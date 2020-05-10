const verifyError = (errors, loginWithRedirect) => {
    if (errors[0].message === 'Could not verify JWT: JWTExpired') {
        alert('La sesión ha expirado, por favor ingresa de nuevo.');
        localStorage.removeItem('siembreAppToken');
        loginWithRedirect();
    } else {
        alert('Se produjo un error, revisa la consola para mas detalles');
        console.log(errors);
    }
};

export default verifyError;
