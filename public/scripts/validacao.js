function mConteiner(){
    let id = event.target.value;
    id = id.replace(/^(\d)/g, "");
    id = id.replace(/(^[a-z])/g, "");
    id = id.replace(/([A-Z])(\d{8})/, "$1");
    id = id.replace(/([a-z])/g, "");
    id = id.replace(/([A-Z]{5})/, "");
    id = id.replace(/([A-Z]{5})(\d)/, "");
    id = id.replace(/(^[A-Z]{4})(\d{8})$/, "");

    event.target.value = id;
}