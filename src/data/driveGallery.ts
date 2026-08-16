/** Owner-provided Google Drive media for Gallery batch b02.
 *
 * Important:
 * - Keep the folder URL itself out of the public UI.
 * - Individual files are rendered only after the folder/file sharing is read-only.
 * - This registry mirrors the received batch; one exact duplicate video entry was collapsed.
 * - File names are operations metadata only and are never rendered to visitors.
 */
export type DriveGalleryKind = "photo" | "video";

export type DriveGalleryItem = {
  id: string;
  kind: DriveGalleryKind;
  fileId: string;
  sourceName: string;
  alt: string;
  published: boolean;
};

const fileIdPattern = /^[A-Za-z0-9_-]{10,}$/;

function makeItem(
  id: string,
  kind: DriveGalleryKind,
  sourceName: string,
  fileId: string,
  index: number,
): DriveGalleryItem {
  if (!fileIdPattern.test(fileId)) {
    throw new Error(`invalid Drive file id for ${id}`);
  }
  return {
    id,
    kind,
    fileId,
    sourceName,
    alt:
      kind === "photo"
        ? `オーナー提供のみりぃさんの写真 ${index}`
        : `オーナー提供のみりぃさんの動画 ${index}`,
    published: true,
  };
}

export const driveGallery: DriveGalleryItem[] = [
  makeItem("mily-drive-b02-p01", "photo", "8AB1EFE4-211D-41D7-A808-DEC341BAE017.jpg", "15mJln0TawgXBhMdwjvAH9c-JmOOjagen", 1),
  makeItem("mily-drive-b02-p02", "photo", "7D748F76-F881-4E8D-B711-05A6C7F1BF73.jpg", "1nSY1Ita1Qd8JgEIxTC67WN3kpIn1r1bf", 2),
  makeItem("mily-drive-b02-p03", "photo", "79B3FFA1-7F5E-4246-8B59-750B761E959F.jpg", "1GwIaJaaVH4a3p7Sag-QkzV34Yd8II2W6", 3),
  makeItem("mily-drive-b02-p04", "photo", "58C2D874-B39B-41C2-8898-47969D227A9C.jpg", "1vwsymU09O8b7JmcJQye6AHPNisqw7uDK", 4),
  makeItem("mily-drive-b02-p05", "photo", "71D0FEC5-A379-4BC7-A30D-6DE14C6A1B80.jpg", "1QomdecFKM-YHvmCmrSeNSkgbDkgQ4ipd", 5),
  makeItem("mily-drive-b02-p06", "photo", "406ADAD5-DEAD-4C25-8E9A-973A70198DEB.jpg", "1XPa8nBM5M0aAIKwvNuPwzg2KZsDd551F", 6),
  makeItem("mily-drive-b02-p07", "photo", "7B142B6F-E140-4E5B-B1AD-3A3E880FCCC8.jpg", "1CXJ31A14QyIt8sE-8JIb3h0RpGstTZYo", 7),
  makeItem("mily-drive-b02-p08", "photo", "5B6A397B-A17A-4C6E-A123-B36F9BF3D52D.jpg", "1i9HzEYc2G1zYzXevhxMGO37r1n3-hRg2", 8),
  makeItem("mily-drive-b02-p09", "photo", "1352BDFA-06CE-4B3E-9D9C-B1073E554704.jpg", "1gg0BrXS0qi1kU6EENH05dXO4JTPjcG9l", 9),
  makeItem("mily-drive-b02-p10", "photo", "135997C7-3231-48FD-B436-D0949BD3D6BE.jpg", "1BiGT84RirHiqZXECOI0xBEJ24o8ZvdS-", 10),
  makeItem("mily-drive-b02-p11", "photo", "6BE57FD4-4A59-4126-9D59-798D7B554261.jpg", "1dci-XApsoy9mZCl5EUaRA9QrYCOedPqW", 11),
  makeItem("mily-drive-b02-p12", "photo", "284E77C4-25B6-4F71-A751-D18C6FFD6A1C.jpg", "1XR5hF30ST0XslV_Ug-j2Ti7Fak9HWFal", 12),
  makeItem("mily-drive-b02-p13", "photo", "6BD0DD85-6BD1-423B-91FF-7398A571CB94.jpg", "1TAE5CchA-oZne04Z8Ec0umWA5-GYZPYD", 13),
  makeItem("mily-drive-b02-p14", "photo", "8218798F-03B9-4F94-9CA1-98756EDA1462.jpg", "1t9f0SfNlXWAdmo7N42UptwAvADLdIEhP", 14),
  makeItem("mily-drive-b02-p15", "photo", "CC881129-3AA2-4D6A-83ED-65E553D2DC1E.jpg", "1xxvHXV8X7Y77Vy5dtNxErw6swFNUiVeO", 15),
  makeItem("mily-drive-b02-p16", "photo", "4196A334-AC06-48E4-A269-467B7BA2A5ED.jpg", "1kOpnhpq3pXPpySomlsdZ4TVujdVbhalf", 16),
  makeItem("mily-drive-b02-p17", "photo", "30CD28A0-9FB6-452D-8845-6616E735BC5E.jpg", "1AGvkAGXTDAVCMfJYcHOceAVUhcs3oCrE", 17),
  makeItem("mily-drive-b02-p18", "photo", "FFFD9803-0C0E-40BF-8D6E-C571BE90478B.jpg", "1ljwP-du24LjNI_haziuz_mP6WxK2cKue", 18),
  makeItem("mily-drive-b02-p19", "photo", "6A317A76-1CEA-40A0-B617-39DE512AAF94.jpg", "1lDfynh4Rg0zBzHUyrzx0n085RG7Sp-8S", 19),
  makeItem("mily-drive-b02-p20", "photo", "A955AE29-623F-409B-BB5C-42C844C67C21.jpg", "1FB9pGilf__JN0q_nvHXSQA_DGzMKIkzD", 20),
  makeItem("mily-drive-b02-p21", "photo", "D5670F06-1C8F-4712-9798-A685CBF6E243.jpg", "1NR_dCXli-RcJhT0zr6dgiapu1LuDjQFx", 21),
  makeItem("mily-drive-b02-p22", "photo", "798D754F-30E6-45E6-8F75-677F33425250.jpg", "1GEgggZ309GX9hR-LzNNCo9CS13LDAdcQ", 22),
  makeItem("mily-drive-b02-p23", "photo", "A9431A79-FD7B-47AD-B380-7D1EADCB1E20.jpg", "1EE-h7ucCWtTX1hl0HcHxZaT8QDoS4fxG", 23),
  makeItem("mily-drive-b02-p24", "photo", "3D133007-144F-47A2-B269-0D6C292A85CB.jpg", "1tHqVo-BKzmg35-uWno8nXGpgIyDpsbUF", 24),
  makeItem("mily-drive-b02-p25", "photo", "FCEAAD9D-77A1-4E11-A527-0DD880924EC1.jpg", "1dGHTN70k2mzAYp7uXBOGPxIvzYGZcB32", 25),
  makeItem("mily-drive-b02-p26", "photo", "B18C80B0-09B9-4389-8A47-43F051162453.jpg", "1INEtqv1Zo3cqg7SjSkEMO0OhoFyUl9qe", 26),
  makeItem("mily-drive-b02-p27", "photo", "D189D5D3-D690-49CA-90A6-B00CA930F2CC.jpg", "1NFcrsJE_wNd-ggpyAMYVqwKAFs-6if5i", 27),
  makeItem("mily-drive-b02-p28", "photo", "CE594044-D67D-4F1F-8A14-17432376D8F8.jpg", "1Pd0Vhzd3YwiXWWmz5axLOn4EnVnsWz8C", 28),
  makeItem("mily-drive-b02-p29", "photo", "0AA1C8FE-6BD6-44A3-907E-00EE89A62024.jpg", "13U4ZrSCTvWv_CjSiUhpFoPiknoY70U8X", 29),
  makeItem("mily-drive-b02-p30", "photo", "A6BEF9B0-9541-428D-A3BE-90662834CB20.jpg", "1rPncAwzXNXJ3Q3k27mHqabrE048VmT7J", 30),
  makeItem("mily-drive-b02-p31", "photo", "7AB5033F-987A-43AC-9ACF-FC5283836547.jpg", "1mVHBCIS8Zg1gHw-a64hG9dNvX_iaLQnE", 31),
  makeItem("mily-drive-b02-p32", "photo", "723BF435-AA70-4876-93AA-7DC3891DF007.jpg", "1N1OBEatPjJlVG6MJv_gOr-mDjX3U2_Bf", 32),
  makeItem("mily-drive-b02-p33", "photo", "1FC90529-0B07-44B2-8D07-E6D9A4373E45.jpg", "1NxM-Hj1Rvswlac2XoTak0ynrFY3cOMAP", 33),
  makeItem("mily-drive-b02-p34", "photo", "235A1809-59A9-482F-94C3-50782BEE24BA.jpg", "1KlWnOUfrPdV8MHLlj4MbDJQSPdZ2EEDc", 34),
  makeItem("mily-drive-b02-p35", "photo", "48BAEEAD-750D-4F14-A7F0-0077DF4615C5.jpg", "1nn8r92n7pgTXSP1M0CBJduR9hl8KkNvZ", 35),
  makeItem("mily-drive-b02-p36", "photo", "342BC189-998B-4D34-9673-CA7143BAC71F.jpg", "1q7Wfu-Ex-X7KKE_hbCDur19fPYv1TQuF", 36),
  makeItem("mily-drive-b02-p37", "photo", "91A119E4-E8FF-48E5-8C27-8B9C3454F3DA.jpg", "18JaQazARzuBAm6pWET0DkLC2p_TE6z9-", 37),
  makeItem("mily-drive-b02-p38", "photo", "3BA1E9F8-6C6E-4D02-85BE-DD843CAC89F8.jpg", "1kPTc8AtS_JoYupNZIB9SG8vrQHpD20O6", 38),
  makeItem("mily-drive-b02-p39", "photo", "IMG_2942.PNG", "10DO4MQMvM4ywAR_sgqlRHnIw-uHQsUiJ", 39),
  makeItem("mily-drive-b02-p40", "photo", "4BD2711F-6872-48A0-8CDC-D5F50E4E0FF9.jpg", "15UWR9PG6EWNbcjve9kf5kt_80T7lpyyI", 40),
  makeItem("mily-drive-b02-p41", "photo", "6BC70E40-6E73-47C6-89BA-88D6D6CCA6B2.jpg", "1KcQY5IU609PLEgfk2ZnVk4n5PfRD0nsc", 41),
  makeItem("mily-drive-b02-p42", "photo", "675BFAC5-1C4E-4D93-9064-DE44AEACEE87.jpg", "1n2nSU6-g-e6cSZXnzltm09lDaz835Ueu", 42),
  makeItem("mily-drive-b02-p43", "photo", "781213E4-7F25-4DB6-AF6E-ED3BD7CDE116.jpg", "1b_qcLW6WqVzxgiegcN8FHsi5QSVWTqyL", 43),
  makeItem("mily-drive-b02-p44", "photo", "79A95B77-390E-4CFC-9EF1-13A6A70EF86F.jpg", "1PnK8PD4Zqz9Zlq1u7hwUBlevUqxMf0cV", 44),
  makeItem("mily-drive-b02-p45", "photo", "E1075080-FCF7-4133-BC75-10E44422DE91.jpg", "1qJlOc3rJYHv1--Fxg159l2ZM2-3koIlC", 45),
  makeItem("mily-drive-b02-p46", "photo", "FF524F82-BD7A-4141-AEDA-A451CB4B0F43.jpg", "13IIL8T0w4wbouL6WtNBi2cK8vdJICJ9t", 46),
  makeItem("mily-drive-b02-v01", "video", "A1948E3A-101D-41D7-A808-DEC341BAE017.mp4", "1En1SlMRb9sjZHu7CLncIowopiKXbwl8d", 1),
  makeItem("mily-drive-b02-v02", "video", "73F51C52-E6D4-4E19-9AC6-6B17EDE0CADE.mp4", "16U67BF5lcHH22rwVx6kzXocFRJibIvfc", 2),
  makeItem("mily-drive-b02-v03", "video", "C3E4497D-2AC9-4CDD-BDFE-DD2D099A2381.mp4", "1OYI5Cv0frvKTPlHm75CpGaFJYMLMJpDp", 3),
  makeItem("mily-drive-b02-v04", "video", "A62F167A-7235-441C-8A45-878825B0FFD6.mp4", "1SS3vNeUinVFpa4gl9pm8XhWYtHjjwyD0", 4),
  makeItem("mily-drive-b02-v05", "video", "CE155D3A-1DEF-493B-A4B0-37BCEB044AF0.mp4", "1unD-yKtP8tXQ2t4DFZofHQtEF62co2RM", 5),
  makeItem("mily-drive-b02-v06", "video", "1CD4FADB-0430-4398-9019-774CAC3FC9C4.mp4", "1StqV8JTbJY67PIpPk7aFdCZZYqa7gdHA", 6),
  makeItem("mily-drive-b02-v07", "video", "SaveClip.App_AQMGmznFQSL_nSsdKHdbLEak8A0H7L5F3LdqqzaMSvGTkddhBkYlR95mLuXbNEvyP1V7KqP6oYYZdXtrR7-QGrv8fZ3JYpx3Is1Oo84.mp4", "1vokzkXO7htHnAypw1QbAxK6R8gZYslmr", 7),
  makeItem("mily-drive-b02-v08", "video", "C8288C8E-44AF-47EA-B04C-E81FBC4155CA.mp4", "143Q5mOfSUNz7WOb53aQ-E1K6UJ55TvuL", 8),
  makeItem("mily-drive-b02-v09", "video", "FBDB94AA-6A6A-4682-952F-AE7837FA8FC9.mp4", "1yb-k263WGAog6dRGGvPlZrtLPUqs1tYO", 9),
  makeItem("mily-drive-b02-v10", "video", "582B7A70-106A-4DC9-8C82-B176F23EB283.mp4", "11cYNJfbBBrNFHxh3m_Ap0ZeUNgtoQvZd", 10),
];

export function visibleDriveGallery(
  items: DriveGalleryItem[] = driveGallery,
): DriveGalleryItem[] {
  return items.filter((item) => item.published);
}

export function driveThumbnailUrl(fileId: string, width = 1200): string {
  const safeWidth = Math.max(320, Math.min(2400, Math.round(width)));
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${safeWidth}`;
}

export function drivePreviewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`;
}

export function driveFileViewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/view`;
}
