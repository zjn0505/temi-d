const Core = require('@alicloud/pop-core');

let client = new Core({
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    endpoint: process.env.ALIYUN_SMS_ENDPOINT,
    apiVersion: process.env.ALIYUN_SMS_ENDPOINT_VERSION
});


export default function sendSMS(phone, name, address) {
    var params = {
        "PhoneNumbers": phone,
        "SignName": process.env.ALIYUN_SMS_SIGN,
        "TemplateCode": process.env.ALIYUN_SMS_TEMPLATE_CODE,
        "TemplateParam": `{\"name\":\"${name}\",\"address\":\"${address}\"}`
    }

    var requestOption = {
        method: 'POST'
    };

    return client.request('SendSms', params, requestOption).then((result) => {
        console.log(JSON.stringify(result));
    }, (ex) => {
        console.log(ex);
    })
}