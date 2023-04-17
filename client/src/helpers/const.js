//export const SERVER_BASE_URL = "http://localhost:4000";
export const SERVER_BASE_URL = "https://testing-heroku-dobest.herokuapp.com";

export const _formatTime = (time) => {
    const temp = time.split(':');
    return temp[0] + ":" + temp[1];
}