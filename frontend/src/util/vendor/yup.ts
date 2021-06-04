import { setLocale } from 'yup';

const ptBR = {
  mixed: {
    required: 'Campo necessário',
    notType: 'Campo inválido'
  },
  string: {
    max: 'Deve ter no máximo ${max} caracteres'
  },
  number: {
    min: 'Deve ser pelo menos ${min}'
  },
  array: {
    min: 'Deve ter pelo menos ${min} item(s)'
  }
};

setLocale(ptBR);

export * from 'yup';