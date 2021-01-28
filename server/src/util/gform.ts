import got from "got";

export default async function submit(
  qNum: number,
  teamNum: number,
  teamName: string,
  signature: string
) {
  const formID = "1FAIpQLSf0bHy019OM_1ibafk41Ym2ZF3sxFKkWIHeeyC4ONl0HmgLcA";
  const url = `https://docs.google.com/forms/d/e/${formID}/formResponse`;
  const form = {
    // Question number
    "entry.1601973989": qNum,
    // Team's guess
    "entry.200685327": "",
    // Team number
    "entry.956233447": teamNum,
    // Team name
    "entry.1057570118": teamName,
    // Phone number
    "entry.1307102251": "N/A",
    // Initials
    "entry.1437090691": signature,
  };

  console.log("Sending form", form, "to url", url);
  if (process.env.NODE_ENV === "production") {
    await got.post(url, { form }).text();
  }
}
