export const extractFormData = (form) => {
    const formdata = new FormData(form);
    const data = {};

    for(const input of formdata.entries()) {
        data[input[0]] = input[1];
    }

    return data;
};
