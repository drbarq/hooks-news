export default function validateLogin(values) {
    let errors = {}
    // email errors
    if (!values.errors) {
        errors.email = "Email Required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid Email Address"
    }
    // password errors
    if (!values.password) {
        errors.password = "Password Required"
    } else if (values.password.length < 6 ) {
        errors.password = "Password must be atleast 6 characters"
    }
    
    return errors
}
