export function initializeFormMovement() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton && signInButton && container) {
        const handleSignUpClick = () => {
            container.classList.add("right-panel-active");
        };

        const handleSignInClick = () => {
            container.classList.remove("right-panel-active");
        };

        signUpButton.addEventListener('click', handleSignUpClick);
        signInButton.addEventListener('click', handleSignInClick);

        // Return een functie om de event listeners te verwijderen
        return () => {
            signUpButton.removeEventListener('click', handleSignUpClick);
            signInButton.removeEventListener('click', handleSignInClick);
        };
    }
}
