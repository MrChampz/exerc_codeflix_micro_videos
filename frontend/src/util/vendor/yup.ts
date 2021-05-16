import { setLocale } from 'yup';

const ptBR = {
  mixed: {
    required: 'Campo necessário'
  },
  string: {
    max: 'Deve ter no máximo ${max} caracteres'
  },
  number: {
    min: 'Deve ter pelo menos ${min} caracteres'
  },
  array: {
    min: 'Deve ter pelo menos ${min} item(s)'
  }
};

setLocale(ptBR);

export * from 'yup';