import { october11StreamSchedule } from "../data/fourthRoundStreamSchedule.ts";
import type { StreamSlot } from "../data/streamSchedule.ts";

/**
 * 最新の確認済み本人告知と開始が一致する登録枠にだけ、未登録の終了予定を補う。
 * APIが削除・変更した開始枠や、API自身の終了時刻は上書きしない。
 * 過去の告知画像は後発変更が未確定なので補完の対象にしない。
 */
export function withConfirmedAnnouncedEndTime(slot: StreamSlot): StreamSlot {
  const announced = october11StreamSchedule.find(
    item => item.date === slot.date && item.time === slot.time,
  );
  if (slot.endTime !== undefined || !announced?.endTime) return slot;
  return {
    ...slot,
    endTime: announced.endTime,
    note: [slot.note, "終了予定は10月11日の本人X告知に基づきます"].filter(Boolean).join(" / "),
  };
}
