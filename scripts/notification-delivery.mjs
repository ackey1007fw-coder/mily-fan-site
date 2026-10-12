import {notificationCopy} from './publication-notification-state.mjs';
import {liveStartEligible,liveStartCopy} from './showroom-start-notification.mjs';

// Explicit existing-connector callbacks only; no API keys, HTTP sender, retries, or polling.
async function sendOnce(finish, payload, publishThreads) {
  try {
    const result = await publishThreads({user:'ackey',platforms:['threads'],...payload});
    finish(result);
    return result;
  } catch {
    const result={state:'unknown',reason:'send_or_receipt_unavailable_reconcile_before_any_action'};
    finish(result);
    return result;
  }
}

export async function deliverPublication(outbox,item,{verifyPublic,publishThreads,now=()=>new Date().toISOString()}) {
  const proof=await verifyPublic(item);
  if(!outbox.claim(item,proof,now()))return {state:'duplicate_or_baseline'};
  const finish=result=>outbox.finish(item.id,result,now());
  return sendOnce(finish,notificationCopy(item),publishThreads);
}

export async function deliverLiveStart(outbox,event,{readExistingState,publishThreads,now=()=>Date.now()}) {
  const first=await readExistingState();
  if(!outbox.claim(event,first.state,first.endedEvents,now()))return {state:'ineligible_or_duplicate'};
  const finish=result=>outbox.finish(event.live_id,result,new Date(now()).toISOString());
  // A queued start event must still describe a fresh live session immediately before send.
  let current;
  try {current=await readExistingState();} catch {
    const result={state:'failed',reason:'pre_send_live_state_unavailable'};finish(result);return result;
  }
  if(!liveStartEligible(event,current.state,current.endedEvents,now())){
    const result={state:'failed',reason:'live_ended_or_stale_before_send'};finish(result);return result;
  }
  return sendOnce(finish,liveStartCopy(),publishThreads);
}
