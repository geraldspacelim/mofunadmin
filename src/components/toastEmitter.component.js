import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastSettings = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}

const Notify = (props) =>  {
    if (props.success) {
        toast.success(props.message, toastSettings);;
    } else {
        console.log("error")
        toast.error(props.message, toastSettings);;
    }
}
export default Notify;