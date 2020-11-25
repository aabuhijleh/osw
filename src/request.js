const fetch = require("node-fetch");
const btoa = require("btoa");
const https = require("https");

const request = async (data) => {
  // workaround MenaME SSL certificate issue
  // see https://stackoverflow.com/questions/20082893/unable-to-verify-leaf-signature
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  // get cookie
  const loginResponse = await fetch(
    "https://hr.massar.com/MenaITech/application/hrms/mename/verify_user.php",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "upgrade-insecure-requests": "1",
      },
      body: `employee_code=${data.employeeCode}&password64=${
        data.password
      }&password=${btoa(
        unescape(encodeURIComponent(data.password))
      )}&company_code=massar&lang1=1&myaccount=1&language_code=1&submit_melogin_validation=0&submit_login_validation=0&su=&ObjectGUID1=`,
      method: "POST",
      mode: "cors",
      agent,
    }
  );

  // clean up cookie
  const regex1 = /expires=.*?; Max-Age=.*?; path=.*?, /g;
  const regex2 = /; Path=\/; Domain=.hr.massar.com/g;
  const cookie = loginResponse.headers
    .get("set-cookie")
    .replace(regex1, "")
    .replace(regex2, "");

  const oswResponse = await fetch(
    "https://hr.massar.com/MenaITech/application/hrms/mename/ESS/online_request/leave_request1.php",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundaryeVrnTnVpAZzkZOxK",
        "upgrade-insecure-requests": "1",
        cookie,
      },
      body: `------WebKitFormBoundaryeVrnTnVpAZzkZOxK\r\nContent-Disposition: form-data; name="leave_date"\r\n\r\n${data.oswDate}\r\n------WebKitFormBoundaryeVrnTnVpAZzkZOxK\r\nContent-Disposition: form-data; name="trans_internal_type"\r\n\r\n4\r\n------WebKitFormBoundaryeVrnTnVpAZzkZOxK\r\nContent-Disposition: form-data; name="f_hour"\r\n\r\n08\r\n------WebKitFormBoundaryeVrnTnVpAZzkZOxK\r\nContent-Disposition: form-data; name="f_min"\r\n\r\n30\r\n------WebKitFormBoundaryeVrnTnVpAZzkZOxK\r\nContent-Disposition: form-data; name="f_AmPm"\r\n\r\nAM\r\n------WebKitFormBoundaryeVrnTnVpAZzkZOxK\r\nContent-Disposition: form-data; name="t_hour"\r\n\r\n05\r\n------WebKitFormBoundaryeVrnTnVpAZzkZOxK\r\nContent-Disposition: form-data; name="t_min"\r\n\r\n00\r\n------WebKitFormBoundaryeVrnTnVpAZzkZOxK\r\nContent-Disposition: form-data; name="t_AmPm"\r\n\r\nPM\r\n------WebKitFormBoundaryeVrnTnVpAZzkZOxK\r\nContent-Disposition: form-data; name="Support_documents"; filename=""\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryeVrnTnVpAZzkZOxK\r\nContent-Disposition: form-data; name="Support_documents1"\r\n\r\n\r\n------WebKitFormBoundaryeVrnTnVpAZzkZOxK\r\nContent-Disposition: form-data; name="notes"\r\n\r\nRotation\r\n------WebKitFormBoundaryeVrnTnVpAZzkZOxK\r\nContent-Disposition: form-data; name="transaction_date"\r\n\r\n${data.oswDate}\r\n------WebKitFormBoundaryeVrnTnVpAZzkZOxK--\r\n`,
      method: "POST",
      mode: "cors",
      agent,
    }
  );

  if (oswResponse.url.includes("?message=notfound")) {
    throw new Error("Invalid credentials");
  }
};

module.exports = request;
