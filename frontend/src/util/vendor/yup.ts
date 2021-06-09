import { array, setLocale, addMethod, ArraySchema } from 'yup';

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

addMethod<ArraySchema<any, any, any, any>>(array, 'genreHasCategories', function () {
  return this.test({
    message: "Cada gênero escolhido precisa ter pelo menos uma categoria selecionada",
    test: (genres, context) => {
      const categoriesIds = context.parent.categories.map(({ id }) => id);
      const hasUnpairedGenres = genres?.every(genre =>
        genre.categories
            .filter(category => categoriesIds.includes(category.id))
            .length !== 0
      );
      return Boolean(hasUnpairedGenres);
    }
  });
});

export * from 'yup';