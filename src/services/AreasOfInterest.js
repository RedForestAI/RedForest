export const AreasOfInterest = {
    warn(message, event) {
        if (event) {
            event.preventDefault();
        }
        alert(message);
    }
}
