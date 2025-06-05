import Swal from 'sweetalert2';

export function notifySuccess(message, title = 'Sucesso!') {
  Swal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonColor: '#3085d6'
  });
}

export function notifyError(message, title = 'Erro!') {
  Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonColor: '#d33'
  });
}
