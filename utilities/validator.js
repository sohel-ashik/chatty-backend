const validator = require('validator')

// ,email,phone,password
function Validator(name,email,phone,password){
    const isName = !validator.isEmpty(name);
    const isMail = validator.isEmail(email);
    const isPhone = validator.isMobilePhone(phone);
    const isPassword = !validator.isEmpty(password);

    return (
        isName &&
        isMail &&
        isPhone &&
        isPassword
    )
}

module.exports = Validator;