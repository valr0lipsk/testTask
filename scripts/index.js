const inputs = ['name', 'surname', 'date', 'email', 'pass', 'rPass'];
const form = document.getElementById('form');
const button = document.getElementById('submit');

document.addEventListener('DOMContentLoaded', function () {
  const dateInput = document.getElementById('date');
  dateInput.max = getTodayDate();

  button.disabled = !form.checkValidity();
});

const handleChange = () => {
  button.disabled = !form.checkValidity();

  validateInputs(form);
}

async function handleSubmit(e) {
  e.preventDefault();
  validateInputs(form);

  if (!form.checkValidity())
    alert('Заполните форму корректно');
  else {
    const body = {};
    for (let i = 0; i < form.elements.length; i++) {
      const item = form.elements.item(i);
      if (inputs.includes(item.id) && item.id !== 'rPass')
        body[item.id] = item.value;
    };

    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const result = await response.json();
    console.log(result);
  }
}
form.addEventListener("submit", handleSubmit);
form.addEventListener("change", handleChange);

function validateInputs(form) {
  for (let key in form.elements) {
    if (inputs.includes(form.elements[key].id)) {
      const input = form.elements[key];
      const parent = input.parentElement;
      clearErrors(parent);

      if (input.validationMessage) {
        appendError(parent, input.validationMessage);
      }

      if (input.id === 'pass' && input.value) {
        const repeatPass = form.elements['rPass'];

        if (repeatPass.value && input.value !== repeatPass.value)
          appendError(repeatPass.parentElement, 'Пароли должны совпадать');
      }
    }
  }
}

function getTodayDate() {
  var d = new Date();
  var day = d.getDate();
  var month = d.getMonth() + 1;
  var year = d.getFullYear();
  if (month < 10) month += 0;
  if (day < 10) day += 0;

  return year + "-0" + month + "-0" + day;
}

function clearErrors(container) {
  let child = container.getElementsByTagName('span');
  if (child.length) {
    child = Array.from(child);
    child.forEach(c => container.removeChild(c));
  };
}

function appendError(container, error) {
  const span = document.createElement("span");
  span.className = 'error'
  span.innerText = error;
  container.append(span);
}