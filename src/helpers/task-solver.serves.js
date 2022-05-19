import i18n from 'i18next';
import _ from 'lodash';

import { solveReaction } from './chemical-search.service';
import { alignment, parse, roundValue } from './root.service';
import PeriodicTableService from './periodical-table.service';
import table from '../json/table.json';
import constants from '../json/constants.json';
import gases from '../json/gases.json';

const t = i18n.t.bind(i18n)

// функция округления значений при вычислениях
const sub = 'в-ва';
const mol = 'моль';
const gmol = 'г/моль';
const rra = 'р-ра';
const g = 'г';
const dm = 'дм';
const gdm = 'г/дм';
const air = 'возд.';
const onAir = 'по возд.';
const raspl = 'распл.';
const rud = 'руды';
const mix = 'смеси';
const jl = 'Дж';
const klv = 'K';
const jmk = 'Дж/(моль×K)';
const pa = 'Па';
const kpa = 'кПа';
const atm = 'атм';
const vih = 'вых.';
const prakt = 'практ.';
const teor = 'теор.';
const atom = 'атома';

export const reactParser = {
  getFormatReaction: function (react) {
    // удаляем все теги
    let formattedReaction = react.replace(/<[^>]+>/g, '');
    // удаляем пробелы
    formattedReaction = formattedReaction.replace(/\s+/g, '');
    if (
      formattedReaction.charAt(0) == '=' ||
      formattedReaction.charAt(0) == '+'
    ) {
      formattedReaction = formattedReaction.substr(1);
    }
    if (
      formattedReaction.charAt(formattedReaction.length - 1) == '=' ||
      formattedReaction.charAt(formattedReaction.length - 1) == '+'
    ) {
      formattedReaction = formattedReaction.substr(
        0,
        formattedReaction.length - 1,
      );
    }
    return formattedReaction;
  },
  createObject: function (react) {
    const object = [];

    const reaction = reactParser.getFormatReaction(react);

    const reactParts = reaction.split('=');
    const reactLeftSubsts = reactParts[0].split('+');
    const reactRightSubsts = reactParts[1].split('+');

    for (var i = 0; i < reactLeftSubsts.length; i++) {
      var substance = {
        subst: reactParser.getPureSubst(reactLeftSubsts[i]),
        coef: reactParser.getCoef(reactLeftSubsts[i]),
        side: 'left',
      };
      object.push(substance);
    }
    for (var i = 0; i < reactRightSubsts.length; i++) {
      var substance = {
        subst: reactParser.getPureSubst(reactRightSubsts[i]),
        coef: reactParser.getCoef(reactRightSubsts[i]),
        side: 'right',
      };
      object.push(substance);
    }
    return object;
  },
  getPureSubst: function (subst) {
    const coef = `${reactParser.getCoef(subst)}`;
    return subst.substr(subst.indexOf(`${coef}`) + coef.length);
  },
  getCoef: function (subst) {
    let coef = 1;
    for (let i = 0; i < subst.length; i++) {
      if (!isNaN(subst.substr(0, i + 1) * 1)) {
        coef = subst.substr(0, i + 1) * 1;
      } else {
        break;
      }
    }
    return coef;
  },
  isSuitableReact: function (react) {
    let isSuitable = true;
    const reaction = reactParser.createObject(react);

    // расчет молярной массы
    function getMolarMass(substance) {
      const list = [];
      list.parse = parse;
      let M = 0;
      const subst = substance.replace(/\s+/g, '');
      list.parse(subst, 1);
      for (let i = 0; i < list.length; i++) {
        M += Math.round(list[i].coef * table[list[i].elements].atomMass);
      }
      return M;
    }

    for (let i = 0; i < reaction.length; i++) {
      if (getMolarMass(reaction[i].subst) <= 0) {
        isSuitable = false;
        break;
      }
    }
    return isSuitable;
  },
};

export const reactSearch = {
  search: async function (value = '') {
    const input = { value };

    const res = {
      list: {
        data: [],
        show: false,
      },
      error: { show: false, text: '' },
    };

    if (reactParser.getFormatReaction(input.value) != '') {
      // -> Объект для работы с поиском реакций
      res.list.data = [];
      const reaction = reactParser.getFormatReaction(input.value);

      res.list.show = false;

      const showReactions = function (response) {
        if (response == null) {
          res.error.text =
            `${t('taskSolver.noEquation')}`;
          res.error.show = true;
        } else if (response.status == 'error') {
          switch (response.error_code) {
            case 1:
              res.error.text =
                `${t('taskSolver.notReaction')}`;
              break;
            default:
              res.error.text =
                `${t('taskSolver.errorTryLater')}`;
              break;
          }
          res.error.show = true;
          res.examples.show = true;
        } else {
          // удаление русских слов в реакциях,типа: (раств.), (катод, анод)
          for (var i = 0; i < response.reactions.length; i++) {
            response.reactions[i].reaction = response.reactions[
              i
            ].reaction.replace(/[а-яА-Я]/g, '');
            response.reactions[i].reaction = response.reactions[
              i
            ].reaction.replace(/\(\)/g, '');
            response.reactions[i].reaction = response.reactions[
              i
            ].reaction.replace(/\( \)/g, '');
            response.reactions[i].reaction = response.reactions[
              i
            ].reaction.replace(/\(.\)/g, '');
            response.reactions[i].reaction = response.reactions[
              i
            ].reaction.replace(/\(., .\)/g, '');
            response.reactions[i].reaction = response.reactions[
              i
            ].reaction.replace(/&#[0-9]+;/g, '');
          }

          // заносим в reactSearch.list.data только подходящие реакции
          for (var i = 0; i < response.reactions.length; i++) {
            if (reactParser.isSuitableReact(response.reactions[i].reaction)) {
              res.list.data.push(response.reactions[i]);
            }
          }
          if (res.list.data.length != 0) {
            res.list.show = true;
          } else {
            res.error.text =
              `${t('taskSolver.tryEnteringManually')}`;
            res.error.show = true;
          }
        }
      };
      try {
        await solveReaction(reaction)
          .then(showReactions)
          .catch(error => {
            res.error.text =
            `${t('taskSolver.tryEnteringManually')}`;

            res.error.show = true;
            res.searchField.show = false;
            res.examples.show = true;
          });
      } catch (e) {}
    } else {
      res.error.text = 'Вы не ввели реакцию!';

      res.error.show = true;
    }

    return res;
  },
  setReaction: function (reaction) {
    return {
      record: reaction,
      object: reactParser.createObject(reaction),
    };
  },
};

export const reactEntering = {
  enter: function (value = '') {
    const input = {
      value,
    };

    const res = {
      reaction: {
        record: '',
        object: [],
      },
      error: { show: false, text: '' },
    };

    res.error.show = false;
    if (reactParser.getFormatReaction(input.value) != '') {
      if (reactEntering.validate(input.value) == 0) {
        // расставить коэффициенты
        const equation = reactParser.getFormatReaction(input.value);
        const { coefs } = alignment(equation);

        // записали реакцию с коэффициентами, которые поставил юзер
        const reaction = reactSearch.setReaction(
          reactParser.getFormatReaction(input.value),
        );

        // проверяем, поставил ли вообще юзер коэффициенты сам или оставил по стандарту единицы
        let coefsByDefault = true;
        for (var i = 0; i < reaction.object.length; i++) {
          if (reaction.object[i].coef != 1) {
            coefsByDefault = false;
            break;
          }
        }

        // если нет ошибок в автоматической расстановке коэффициентов и юзер сам не расставлял коэффициенты, то пишем автокоэффициенты
        if (res.error.text == '' && coefsByDefault) {
          for (var i = 0; i < coefs.length; i++) {
            reaction.object[i].coef = coefs[i];
          }
        }
        res.reaction = reaction;
      } else {
        res.error.text = reactEntering.validate(input.value);
        res.error.show = true;
      }
    } else {
      (res.error.text = 'Вы не ввели реакцию!'), (res.error.show = true);
    }
    return res;
  },

  validate: function (react) {
    let errorText = '';
    const reaction = reactParser.getFormatReaction(react);
    if (reaction.indexOf('=') < 0) {
      errorText =
        `${t('taskSolver.necessaryEnterFullReaction')}`;
    } else if (reaction.indexOf('+') < 0) {
      errorText = `${t('taskSolver.noPlusSign')}`;
    } else if (!reactParser.isSuitableReact(reaction)) {
      errorText =
        `${t('taskSolver.unknownSubst')}`;
    }

    if (errorText != '') {
      return errorText;
    }
    return 0;
  },
};

export const checkSubstFormula = function (value) {
  const res = { subst: '', substB: '', errors: [] };

  const periodic_table = new PeriodicTableService();
  const substance = value.replace(/\s+/g, '');

  // посчитать молярную массу, а пока просто проврка на пустую строку
  if (substance != '') {
    const molarMass = getMolarMass(substance);

    if (molarMass.errors.length > 0) {
      const validationErrors = molarMass.errors;
      res.errors = validationErrors;
      return res;
    }

    if (molarMass.value <= 0) {
      res.errors = [`${t('taskSolver.incorrectFormula')}`];
    } else {
      res.subst = substance;
      res.substB = `(${substance})`;
      // deleteFromVarList('M_v');
      // subst = substance;
      // substB = `(${substance})`;
    }
  } else {
    res.errors = [`${t('taskSolver.noSubstFormula')}`];
  }

  return res;

  // расчет молярной массы
  function getMolarMass(substance) {
    const list = [],
      subst = substance.replace(/\s+/g, '');
    let M = 0;

    list.parse = parse;
    list.parse(subst, 1);

    for (let i = 0; i < list.length; i++) {
      M += Math.round(
        list[i].coef *
          periodic_table.getElementById(_.parseInt(list[i].elements) + 1)
            .atomMass,
      );
    }

    return {
      errors: list.err ? list.err : [],
      value: M,
    };
  }
};

export const setSelectedVariable = function ({
  variablesList,
  givenFields,
  variable,
  lang,
  isSimple,
}) {
  let error = '';
  for (let i = 0; i < variablesList.length; i++) {
    if (variablesList[i].var == variable && variable != 'select') {
      let isVarInFields = false;
      for (let j = 0; j < givenFields.length; j++) {
        if (givenFields[j].var == variable) {
          isVarInFields = true;
        }
      }

      if (isVarInFields && isSimple) {
        error = `${t('taskSolver.field')} "${variablesList[i].name[lang]}" ${t('taskSolver.alreadyFull')}`;
      }

      break;
    }
  }

  return { error };
};

export const checkGivenString = function ({
  givenFields,
  fillingField,
  variableValue,
  variableSubstance,
  isSimple,
}) {
  let error = '';
  if (variableValue == undefined) {
    error = `${t('taskSolver.noValue')}`;
  } else if (!Number(variableValue) || variableValue <= 0) {
    error = `${t('taskSolver.mustBeGreaterZero')}`;
  } else if (!isSimple) {
    if (variableSubstance == '') {
      error = `${t('taskSolver.noSubst')}`;
    } else {
      for (let i = 0; i < givenFields.length; i++) {
        if (
          givenFields[i].variable == fillingField.variable &&
          givenFields[i].subst == fillingField.subst
        ) {
          error =
            `${t('taskSolver.field')} "` +
            givenFields[i].symbol +
            `" ${t('taskSolver.for')} ` +
            givenFields[i].subst +
            ` ${t('taskSolver.alreadyFull')}`;
          break;
        }
      }
    }
  }

  return { error };
};

export const setSelectedFindVariable = function ({
  variable,
  variablesList,
  findFields,
  isSimple,
  lang,
}) {
  let error = '';
  for (let i = 0; i < variablesList.length; i++) {
    if (variablesList[i].var == variable && variable != 'select') {
      let isVarInFields = false;
      for (let j = 0; j < findFields.length; j++) {
        if (findFields[j].var == variable) {
          isVarInFields = true;
        }
      }

      if (isVarInFields && isSimple) {
        error = `${t('taskSolver.field')} "${variablesList[i].name[lang]}" ${t('taskSolver.alreadyFull')}`;
      }

      break;
    }
  }

  return { error };
};

export const checkFindString = function ({ subst, findFields }) {
  let error = '';
  let isRepeating = false;

  function isSubstRepeated(subst) {
    let isRepeated = true;
    if (findFields.length > 0) {
      isRepeated = false;
      for (let i = 0; i < findFields.length; i++) {
        if (findFields[i].subst == subst) {
          isRepeated = true;
          break;
        }
      }
    }
    return isRepeated;
  }

  if (subst.subst == '') {
    error = `${t('taskSolver.noSubst')}`;
  } else if (!isSubstRepeated(subst.subst)) {
    error =
      `${t('taskSolver.onlyOneAllowed')}`;
  }

  return { error };
};

const convertMeasures = function ({
  givenFields,
  variablesList,
  isSimple,
  lang,
}) {
  let convertedMeasures = [];
  for (let i = 0; i < givenFields.length; i++) {
    var indexInVarList;
    for (let j = 0; j < variablesList.length; j++) {
      if (variablesList[j].var == givenFields[i].var) {
        indexInVarList = j;
        break;
      }
    }
    if (
      givenFields[i].measure !=
        variablesList[indexInVarList].measures[lang][0] &&
      indexInVarList != undefined
    ) {
      const multiplier =
        variablesList[indexInVarList].measures.multipliers[
          variablesList[indexInVarList].measures[lang].indexOf(
            givenFields[i].measure,
          )
        ];
      const convertedMeasure = {
        var: givenFields[i].measure,
        symbol: givenFields[i].symbol,
        measure: givenFields[i].measure,
        measure2: variablesList[indexInVarList].measures[lang][0],
        multiplier: multiplier,
        value: givenFields[i].value,
        value2: roundValue(
          givenFields[i].value * multiplier,
          givenFields[i].measure,
        ),
      };
      if (!isSimple) {
        convertedMeasure.subst = givenFields[i].subst;
      }
      convertedMeasures.push(convertedMeasure);

      // замена в старом массиве на конвертированные величины
      givenFields[i].value = roundValue(
        givenFields[i].value * multiplier,
        givenFields[i].measure,
      );
      givenFields[i].measure = variablesList[indexInVarList].measures[lang][0];
    }
  }
  return { convertedMeasures };
};

export const solveProblem = function ({
  isSimple,
  findFields,
  givenFields,
  reaction,
  variablesList,
  lang,
  substance = '',
}) {
  let answers = [];
  let shortAnswers = []; // ответы в самом конце
  let solutionErrors = [];
  let steps = [];
  let solutionWaitingShow = true;
  let solutionErrorsShow = false;
  let readySolutionShow = false;
  let solutions = [];
  let singleAnswer = [];
  let givenFieldsSol = [];
  let findFieldsSol = [];
  let quantityGivenField = {};
  let answerSol = [];
  let subst = substance;
  let substB = subst ? `(${subst})`: ''

  let reactRemarks = {
    top: [],
    bottom: [],
  };

  let vars = {
    M_v: undefined,
    M_r: undefined,
    m_v: undefined,
    m_r: undefined,
    m_raspl: undefined,
    m_rud: undefined,
    m_smesi: undefined,
    n_v: undefined,
    V_v: undefined,
    V_n: undefined,
    V_r: undefined,
    V_raspl: undefined,
    V_rud: undefined,
    V_smesi: undefined,
    w_v: undefined,
    fi: undefined,
    ro_v: undefined,
    ro_r: undefined,
    ro_raspl: undefined,
    ro_rud: undefined,
    ro_smesi: undefined,
    ma_v: undefined,
    N_v: undefined,
    P: undefined,
    T: undefined,
    D_h: undefined,
    D_vozd: undefined,
    C_v: undefined,
  };

  const { convertedMeasures } = convertMeasures({
    givenFields,
    variablesList,
    isSimple,
    lang,
  });

  function resetVars() {
    for (const variable in vars) {
      vars[variable] = undefined;
    }
    singleAnswer = [];
    subst = '';
    substB = '';
  }

  function fillUndefinedVars() {
    vars = _.fill(vars, undefined);
    for (let i = 0; i < givenFields.length; i++) {
      vars[givenFields[i].var] = givenFields[i].value;
    }
  }

  function tryToFind(variable) {
    let step = {};

    switch (variable) {
      case 'M_v':
        if (vars.M_v == undefined) {
          if (typeof subst === 'string' && subst !== '') {
            const list = new Array();
            list.parse = parse;
            // посчитать молярную массу
            function calculateMolarMass() {
              vars.M_v = 0;
              subst = subst.replace(/\s+/g, '');
              list.parse(subst, 1);
              for (let i = 0; i < list.length; i++) {
                vars.M_v += Math.round(
                  list[i].coef * table[list[i].elements].atomMass,
                );
              }
            }
            calculateMolarMass();

            function generateExplanation(lang) {
              const explanation = {
                explanationData: [],
              };
              if (list.length > 1) {
                explanation.ru = `<div>Откроем таблицу Менделеева и посчитаем молярную массу вещества ${substB}, суммируя молярные массы простых веществ, которые входят в его состав.</div><div class="remark">Очень подробно это объясняется в разделе "Найти молярную массу"</div><div>`;
                explanation.ru += `<span>M(${subst})</span> = <span>`;

                explanation.explanationData = [
                  {
                    type: 'text',
                    data: [
                      `${t('taskSolver.generateExplanation1', {substB})}`,
                    ],
                  },
                  {
                    type: 'text',
                    data: [
                      `${t('taskSolver.generateExplanation2')}`,
                    ]
                  },
                  {
                    type: 'text',
                    data: [`M(${subst}) = `],
                  },
                ];

                for (let i = 0; i < list.length; i++) {
                  explanation.ru += '<span>M(';
                  explanation.explanationData[2].data += `M(`;
                  if (list[i].coef > 1) {
                    explanation.ru += `<span>${list[i].coef}</span>`;
                    explanation.explanationData[2].data += `${list[i].coef}`;
                  }
                  explanation.ru += `<span>${
                    table[list[i].elements].element
                  }</span>)</span>`;
                  explanation.explanationData[2].data += `${
                    table[list[i].elements].element
                  })`;
                  if (list.indexOf(list[i]) != list.length - 1) {
                    explanation.ru += '<span> + </span>';
                    explanation.explanationData[2].data += ` + `;
                  }
                }
                explanation.ru += `</span> = <span>${vars.M_v} г/моль</span></div>`;
                explanation.explanationData[2].data = [explanation.explanationData[2].data + ` = ${vars.M_v} ${t('gmole')}`];
              } else {
                explanation.ru = `<div>Откроем таблицу Менделеева и найдем в ней молярную массу вещества ${substB}</div><div>M${substB} = ${vars.M_v} г/моль</div>`;
                explanation.explanationData = [
                  {
                    type: 'text',
                    data: [
                      `${t('taskSolver.generateExplanation3', {substB})}`,
                    ],
                  },
                  {
                    type: 'text',
                    data: [`M${substB} = ${vars.M_v} ${t('gmole')}`],
                  },
                ];
              }
              return explanation;
            }

            step = {
              variable: 'M_v',
              value: vars.M_v,
              dependencies: [],
              record: {
                ru: `M${substB} = ${vars.M_v} г/моль`,
              },
              explanation: {
                ru: generateExplanation('ru').ru,
              },
              recordData: [
                {
                  type: 'text',
                  data: [`M${substB} = ${vars.M_v} ${t('gmole')}`],
                },
              ],
              explanationData: generateExplanation('ru').explanationData,
            };
          } else if (vars.n_v != undefined && vars.m_v != undefined) {
            vars.M_v = roundValue(vars.m_v / vars.n_v, 'M_v');
            step = {
              variable: 'M_v',
              value: vars.M_v,
              dependencies: ['m_v', 'n_v'],
              record: {
                ru: `<div><span class="formula">n = <span class="fraction"><span class="top">m</span><span class="bottom">M</span></span></span></div><div><span class="formula">M<sub>в-ва</sub>${substB} = <span class="fraction"><span class="top">m<sub>в-ва</sub>${substB}</span><span class="bottom">n<sub>в-ва</sub>${substB}</span></span> = <span class="fraction"><span class="top">${vars.m_v} г</span><span class="bottom">${vars.n_v} моль</span></span> = ${vars.M_v} г/моль</span></div>`,
              },
              explanation: {
                ru: `<div>Запишем формулу нахождения химического количества (n) через массу (m) и молярную массу (M) вещества:</div><div><span class="formula">n = <span class="fraction"><span class="top">m</span><span class="bottom">M</span></span></span></div><div>Выразим из этой формулы молярную массу (M). Химическое количество (n) и масса (m) нам известны, поэтому мы можем найти молярную массу (M):</div><div><span class="formula">M<sub>в-ва</sub>${substB} = <span class="fraction"><span class="top">m<sub>в-ва</sub>${substB}</span><span class="bottom">n<sub>в-ва</sub>${substB}</span></span> = <span class="fraction"><span class="top">${vars.m_v} г</span><span class="bottom">${vars.n_v} моль</span></span> = ${vars.M_v} г/моль</span></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: ['n = ', ['m', 'M']],
                },
                {
                  type: 'formula',
                  data: [
                    `M<sub>${t('subs')}</sub>${substB} = `,
                    [`m<sub>${t('subs')}</sub>${substB}`, `n<sub>${t('subs')}</sub>${substB}`],
                    ' = ',
                    [`${vars.m_v} ${t('g')}`, `${vars.n_v} ${t('mole')}`],
                    ` = ${vars.M_v} ${t('gmole')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.generateExplanation4')}`],
                },
                {
                  type: 'formula',
                  data: ['n = ', ['m', 'M']],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.generateExplanation5')}`],
                },
                {
                  type: 'formula',
                  data: [
                    `M<sub>${t('subs')}</sub>${substB} = `,
                    [`m<sub>${t('subs')}</sub>${substB}`, `n<sub>${t('subs')}</sub>${substB}`],
                    ' = ',
                    [`${vars.m_v} ${t('g')}`, `${vars.n_v} ${t('mole')}`],
                    ` = ${vars.M_v} ${t('gmole')}`,
                  ],
                },
              ],
            };
          } else if (vars.D_h != undefined) {
            vars.M_v = roundValue(vars.D_h * constants.M_h.value, 'M_v');
            step = {
              variable: 'M_v',
              value: vars.M_v,
              dependencies: ['d_h'],
              record: {
                ru: `<div><span class="formula">D<sub>по H<sub>2</sub></sub> = <span class="fraction"><span class="top">M<sub>в-ва</sub></span><span class="bottom">M(H<sub>2</sub>)</span></span></span></div><div><span class="formula">M<sub>в-ва</sub> = D<sub>по H<sub>2</sub></sub> × M(H<sub>2</sub>) = ${vars.D_h} × ${constants.M_h.record} г/моль = ${vars.M_v} г/моль</span></div>`,
              },
              explanation: {
                ru: `<div>Относительная плотность вещества по водороду - это отношение молярной массы этого вещества к молярной массе водорода. Формула для расчета относительной плотности по водороду:</div><div><span class="formula">D<sub>по H<sub>2</sub></sub> = <span class="fraction"><span class="top">M<sub>в-ва</sub></span><span class="bottom">M(H<sub>2</sub>)</span></span></span></div><div>Относительную плотность по водороду и молярную массу водорода мы знаем, так что выразим из этой формулы молярную массу (M) вещества и найдем её:</div><div><span class="formula">M<sub>в-ва</sub> = D<sub>по H2</sub></sub> × M<sub>H<sub>2</sub></sub> = ${vars.D_h} × ${constants.M_h.record} г/моль = ${vars.M_v} г/моль</span></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `D<sub>${t('to')} H<sub>2</sub></sub> = `,
                    [`M<sub>${t('subs')}</sub>`, `M(H<sub>2</sub>)`],
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `M<sub>${t('subs')}</sub> = D<sub>${t('to')} H<sub>2</sub></sub> × M(H<sub>2</sub>) = ${vars.D_h} × ${constants.M_h.record} ${t('gmole')} = ${vars.M_v} ${t('gmole')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.generateExplanation6')}`],
                },
                {
                  type: 'formula',
                  data: [
                    `D<sub>${t('to')} H<sub>2</sub></sub> = `,
                    [`M<sub>${t('subs')}</sub>`, `M(H<sub>2</sub>)`],
                  ],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.generateExplanation7')}`],
                },

                {
                  type: 'formula',
                  data: [
                    `M<sub>${t('subs')}</sub> = D<sub>${t('to')} H<sub>2</sub></sub> × M<sub>H<sub>2</sub></sub> = ${vars.D_h} × ${constants.M_h.record} ${t('gmole')} = ${vars.M_v} ${t('gmole')}`,
                  ],
                },
              ],
            };
          } else if (vars.D_vozd != undefined) {
            vars.M_v = roundValue(vars.D_vozd * constants.M_vozd.value, 'M_v');
            step = {
              variable: 'M_v',
              value: vars.M_v,
              dependencies: ['d_h'],
              record: {
                ru: `<div><span class="formula">D<sub>по возд.</sub> = <span class="fraction"><span class="top">M<sub>в-ва</sub></span><span class="bottom">M<sub>возд.</sub></span></span></span></div><div><span class="formula">M<sub>в-ва</sub> = D<sub>по возд.</sub> × M<sub>возд.</sub> = ${vars.D_vozd} × ${constants.M_vozd.record} г/моль = ${vars.M_v} г/моль</span></div>`,
              },
              explanation: {
                ru: `<div>Относительная плотность вещества по воздуху - это отношение молярной массы этого вещества к молярной массе воздуха. Формула для расчета относительной плотности по воздуху:</div><div><span class="formula">D<sub>по возд.</sub> = <span class="fraction"><span class="top">M<sub>в-ва</sub></span><span class="bottom">M<sub>возд.</sub></span></span></span></div><div>Относительную плотность по воздуху и молярную массу воздуха мы знаем, так что выразим из этой формулы молярную массу (M) вещества и найдем её:</div><div><span class="formula">M<sub>в-ва</sub> = D<sub>по возд.</sub></sub> × M<sub>возд.</sub> = ${vars.D_vozd} × ${constants.M_vozd.record} г/моль = ${vars.M_v} г/моль</span></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `D<sub>${t('to')} ${t('air')}</sub> = `,
                    [`M<sub>${t('subs')}</sub>`, `M<sub>${t('air')}</sub>`],
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `M<sub>${t('subs')}</sub> = D<sub>${t('to')} ${t('air')}</sub> × M<sub>${t('air')}</sub> = ${vars.D_vozd} × ${constants.M_vozd.record} ${t('gmole')} = ${vars.M_v} ${t('gmole')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.generateExplanation8')}`],
                },
                {
                  type: 'formula',
                  data: [
                    `D<sub> ${t('air')}</sub> = `,
                    [`M<sub>${t('subs')}</sub>`, `M<sub>${t('air')}</sub>`],
                  ],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.generateExplanation9')}`],
                },
                {
                  type: 'formula',
                  data: [
                    `M<sub>${t('subs')}</sub> = D<sub>${t('to')} ${t('air')}</sub> × M<sub>${t('air')}</sub> = ${vars.D_vozd} × ${constants.M_vozd.record} ${t('gmole')} = ${vars.M_v} ${t('gmole')}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'M_r':
        if (vars.M_r == undefined) {
          // здесь было условие на расчет по формуле в-ва, но все-таки лучше в 2 шага. сначала M, потом Ar

          if (vars.M_v != undefined) {
            vars.M_r = vars.M_v;
            step = {
              variable: 'M_r',
              value: vars.M_r,
              dependencies: [],
              record: {
                ru: `M<sub>r</sub>${substB} = M${substB} = ${vars.M_r}`,
              },
              explanation: {
                ru: `<div>Относительная молекулярная масса численно равна молярной массе, а ее мы знаем.</div><div>M<sub>r</sub>${substB} = M${substB} = ${vars.M_r}</div>`,
              },
              recordData: [
                {
                  type: 'text',
                  data: [`M<sub>r</sub>${substB} = M${substB} = ${vars.M_r}`],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.generateExplanation10')}`,
                  ],
                },
                {
                  type: 'text',
                  data: [`M<sub>r</sub>${substB} = M${substB} = ${vars.M_r}`],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }

        break;

      case 'm_v':
        if (vars.m_v == undefined) {
          if (vars.n_v != undefined && vars.M_v != undefined) {
            vars.m_v = roundValue(vars.n_v * vars.M_v, 'm_v');
            step = {
              variable: 'm_v',
              value: vars.m_v,
              dependencies: ['n_v', 'M_v'],
              record: {
                ru: `<div class='formula'>n = <span class='fraction'><span class='top'>m</span><span class='bottom'>M</span></span>;</div><div class='formula'>m${substB} = n${substB} × M${substB} = ${vars.n_v} моль × ${vars.M_v} г/моль = ${vars.m_v} г</div>`,
              },
              explanation: {
                ru: `<div class='formula'>n = <span class='fraction'><span class='top'>m</span><span class='bottom'>M</span></span></div><div>
                  'Из этой формулы выразим массу вещества и найдем ее значение',
                :</div><div class='formula'>m${substB} = n${substB} × M${substB} = ${vars.n_v} ${mol} × ${vars.M_v} ${gmol} = ${vars.m_v} ${t('g')}</div>`,
              },
              recordData: [
                { type: 'formula', data: [`n = `, [`m`, `M`], ';'] },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = n${substB} × M${substB} = ${vars.n_v} ${t('mole')} × ${vars.M_v} ${t('gmole')} = ${vars.m_v} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                { type: 'formula', data: [`n = `, [`m`, `M`]] },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_v1')}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = n${substB} × M${substB} = ${vars.n_v} ${t('mole')} × ${vars.M_v} ${t('gmole')} = ${vars.m_v} ${t('g')}`,
                  ],
                },
              ],
            };
          } else if (vars.ro_v != undefined && vars.V_v != undefined) {
            vars.m_v = roundValue(vars.ro_v * vars.V_v, 'm_v');
            step = {
              variable: 'm_v',
              dependencies: ['ro_v', 'V_v'],
              value: vars.m_v,
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>m${substB} = ρ${substB} × V${substB} = ${vars.ro_v} г/дм<sup>3</sup> × ${vars.V_v} дм<sup>3</sup> = ${vars.m_v} г</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массу (m), плотность (ρ) и объём (V), записывается так:</div><div class='formula'>m = ρ × V</div><div>По этой формуле найдем массу вещества ${subst}:</div><div class='formula'>m${substB} = ρ${substB} × V${substB} = ${vars.ro_v} г/дм<sup>3</sup> × ${vars.V_v} дм<sup>3</sup> = ${vars.m_v} г</div>`,
              },
              recordData: [
                { type: 'formula', data: ['m = ρ × V'] },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = ρ${substB} × V${substB} = ${vars.ro_v} ${t('gdm')}<sup>3</sup> × ${vars.V_v} ${t('gdm')}<sup>3</sup> = ${vars.m_v} г`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.formulaConnectingMPV')}`],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_v3', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = ρ${substB} × V${substB} = ${vars.ro_v} ${t('gdm')}<sup>3</sup> × ${vars.V_v} ${t('dm')}<sup>3</sup> = ${vars.m_v} ${t('g')}`,
                  ],
                },
              ],
            };
          } else if (vars.ma_v != undefined && vars.N_v != undefined) {
            vars.m_v = roundValue(vars.ma_v * vars.N_v, 'm_v');
            step = {
              variable: 'm_v',
              dependencies: ['ma_v', 'N_v'],
              value: vars.m_v,
              record: {
                ru: `<div class='formula'>N = <span class='fraction'><span class='top'>m</span><span class='bottom'>m<sub>атома</sub></span></span></div><div class='formula'>m${substB} = N${substB} × m<sub>атома</sub>${substB} = ${vars.N_v} × ${vars.ma_v} г = ${vars.m_v} г</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая количество структурных единиц (N), массу (m) и массу атома (m<sub>атома</sub>), записывается так:</div><div class='formula'>N = <span class='fraction'><span class='top'>m</span><span class='bottom'>m<sub>атома</sub></span></span></div><div>Из этой формулы выразим массу вещества ${subst}:</div><div class='formula'>m${substB} = N${substB} × m<sub>атома</sub>${substB} = ${vars.N_v} × ${vars.ma_v} г = ${vars.m_v} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`N = `, [`m`, `m<sub>${t('atom')}</sub>`]],
                },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = N${substB} × m<sub>${t('atom')}</sub>${substB} = ${vars.N_v} × ${vars.ma_v} ${t('g')} = ${vars.m_v} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.m_v4')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`N = `, [`m`, `m<sub>${t('atom')}</sub>`]],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_vExpressMassFromFormula', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = N${substB} × m<sub>${t('atom')}</sub>${substB} = ${vars.N_v} × ${vars.ma_v} ${t('g')} = ${vars.m_v} ${t('g')}`,
                  ],
                },
              ],
            };
          } else if (vars.m_r != undefined && vars.w_v != undefined) {
            vars.m_v = roundValue((vars.m_r * vars.w_v) / 100, 'm_v');
            step = {
              variable: 'm_v',
              dependencies: ['m_r', 'w_v'],
              value: vars.m_v,
              record: {
                ru: `<div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>р-ра</sub></span></span> × 100%</div><div class='formula'>m${substB} = <span class='fraction'><span class='top'>m<sub>р-ра</sub>${substB} × ω${substB}</span><span class='bottom'>100%</span></span> = <span class='fraction'><span class='top'>${vars.m_r} г × ${vars.w_v}%</span><span class='bottom'>100%</span></span> = ${vars.m_v} г</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу раствора (m<sub>р-ра</sub>), записывается так:</div><div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>р-ра</sub></span></span> × 100%</div><div>Из этой формулы выразим массу вещества ${subst}:</div><div class='formula'>m${substB} = <span class='fraction'><span class='top'>m<sub>р-ра</sub>${substB} × ω${substB}</span><span class='bottom'>100%</span></span> = <span class='fraction'><span class='top'>${vars.m_r} г × ${vars.w_v}%</span><span class='bottom'>100%</span></span> = ${vars.m_v} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('sol')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = `,
                    [`m<sub>${t('sol')}</sub>${substB} × ω${substB}`, `100%`],
                    ` = `,
                    [`${vars.m_r} ${t('g')} × ${vars.w_v}%`, `100%`],
                    ` = ${vars.m_v} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.m_v6')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('sol')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_vExpressMassFromFormula', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = `,
                    [`m<sub>${t('sol')}</sub>${substB} × ω${substB}`, `100%`],
                    ` = `,
                    [`${vars.m_r} ${t('g')} × ${vars.w_v}%`, `100%`],
                    ` = ${vars.m_v} ${t('g')}`,
                  ],
                },
              ],
            };
          } else if (vars.m_smesi != undefined && vars.w_v != undefined) {
            vars.m_v = roundValue((vars.m_smesi * vars.w_v) / 100, 'm_v');
            step = {
              variable: 'm_v',
              dependencies: ['m_smesi', 'w_v'],
              value: vars.m_v,
              record: {
                ru: `<div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>смеси</sub></span></span> × 100%</div><div class='formula'>m${substB} = <span class='fraction'><span class='top'>m<sub>смеси</sub>${substB} × ω${substB}</span><span class='bottom'>100%</span></span> = <span class='fraction'><span class='top'>${vars.m_smesi} г × ${vars.w_v}%</span><span class='bottom'>100%</span></span> = ${vars.m_v} г</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу смеси веществ (m<sub>смеси</sub>), записывается так:</div><div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>смеси</sub></span></span> × 100%</div><div>Из этой формулы выразим массу вещества ${subst}:</div><div class='formula'>m${substB} = <span class='fraction'><span class='top'>m<sub>смеси</sub>${substB} × ω${substB}</span><span class='bottom'>100%</span></span> = <span class='fraction'><span class='top'>${vars.m_smesi} г × ${vars.w_v}%</span><span class='bottom'>100%</span></span> = ${vars.m_v} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('sol')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = `,
                    [`m<sub>${t('mix')}</sub>${substB} × ω${substB}`, `100%`],
                    ` = `,
                    [`${vars.m_smesi} ${t('g')} × ${vars.w_v}%`, `100%`],
                    ` = ${vars.m_v} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.m_v7')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('mix')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_vExpressMassFromFormula', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = `,
                    [`m<sub>${t('mix')}</sub>${substB} × ω${substB}`, `100%`],
                    ` = `,
                    [`${vars.m_smesi} ${t('g')} × ${vars.w_v}%`, `100%`],
                    ` = ${vars.m_v} ${t('g')}`,
                  ],
                },
              ],
            };
          } else if (vars.m_raspl != undefined && vars.w_v != undefined) {
            vars.m_v = roundValue((vars.m_raspl * vars.w_v) / 100, 'm_v');
            step = {
              variable: 'm_v',
              dependencies: ['m_raspl', 'w_v'],
              value: vars.m_v,
              record: {
                ru: `<div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>распл.</sub></span></span> × 100%</div><div class='formula'>m${substB} = <span class='fraction'><span class='top'>m<sub>распл.</sub>${substB} × ω${substB}</span><span class='bottom'>100%</span></span> = <span class='fraction'><span class='top'>${vars.m_raspl} г × ${vars.w_v}%</span><span class='bottom'>100%</span></span> = ${vars.m_v} г</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу расплава (m<sub>распл.</sub>), записывается так:</div><div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>распл.</sub></span></span> × 100%</div><div>Из этой формулы выразим массу вещества ${subst}:</div><div class='formula'>m${substB} = <span class='fraction'><span class='top'>m<sub>распл.</sub>${substB} × ω${substB}</span><span class='bottom'>100%</span></span> = <span class='fraction'><span class='top'>${vars.m_raspl} г × ${vars.w_v}%</span><span class='bottom'>100%</span></span> = ${vars.m_v} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('melt')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = `,
                    [`m<sub>${t('melt')}</sub>${substB} × ω${substB}`, `100%`],
                    ` = `,
                    [`${vars.m_raspl} ${t('g')} × ${vars.w_v}%`, `100%`],
                    ` = ${vars.m_v} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.m_v8')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('melt')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_vExpressMassFromFormula', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = `,
                    [`m<sub>${t('melt')}</sub>${substB} × ω${substB}`, `100%`],
                    ` = `,
                    [`${vars.m_raspl} ${t('g')} × ${vars.w_v}%`, `100%`],
                    ` = ${vars.m_v} g`,
                  ],
                },
              ],
            };
          } else if (vars.m_rud != undefined && vars.w_v != undefined) {
            vars.m_v = roundValue((vars.m_rud * vars.w_v) / 100, 'm_v');
            step = {
              variable: 'm_v',
              dependencies: ['m_rud', 'w_v'],
              value: vars.m_v,
              record: {
                ru: `<div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>руды</sub></span></span> × 100%</div><div class='formula'>m${substB} = <span class='fraction'><span class='top'>m<sub>руды</sub>${substB} × ω${substB}</span><span class='bottom'>100%</span></span> = <span class='fraction'><span class='top'>${vars.m_rud} г × ${vars.w_v}%</span><span class='bottom'>100%</span></span> = ${vars.m_v} г</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу руды (m<sub>руды</sub>), записывается так:</div><div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>руды</sub></span></span> × 100%</div><div>Из этой формулы выразим массу вещества ${subst}:</div><div class='formula'>m${substB} = <span class='fraction'><span class='top'>m<sub>руды</sub>${substB} × ω${substB}</span><span class='bottom'>100%</span></span> = <span class='fraction'><span class='top'>${vars.m_rud} г × ${vars.w_v}%</span><span class='bottom'>100%</span></span> = ${vars.m_v} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('ore')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = `,
                    [`m<sub>${t('ore')}</sub>${substB} × ω${substB}`, `100%`],
                    ` = `,
                    [`${vars.m_rud} ${t('g')} × ${vars.w_v}%`, `100%`],
                    ` = ${vars.m_v} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.m_v9')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('ore')}</sub>`],
                    ` × 100%`,
                  ],
                },

                {
                  type: 'text',
                  data: [`${t('taskSolver.m_vExpressMassFromFormula', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m${substB} = `,
                    [`m<sub>${t('ore')}</sub>${substB} × ω${substB}`, `100%`],
                    ` = `,
                    [`${vars.m_rud} ${t('g')} × ${vars.w_v}%`, `100%`],
                    ` = ${vars.m_v} ${t('g')}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }

        break;

      case 'm_r':
        if (vars.m_r == undefined) {
          if (vars.ro_r != undefined && vars.V_r != undefined) {
            vars.m_r = roundValue(vars.ro_r * vars.V_r, 'm_r');
            step = {
              variable: 'm_r',
              value: vars.m_r,
              dependencies: ['ro_r', 'V_r'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>m<sub>р-ра ${subst}</sub> = ρ<sub>р-ра ${subst}</sub> × V<sub>р-ра ${subst}</sub> = ${vars.ro_r} г/дм<sup>3</sup> × ${vars.V_r} дм<sup>3</sup> = ${vars.m_r} г</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массу (m), плотность (ρ) и объём (V), записывается так:</div><div class='formula'>m = ρ × V</div><div>По этой формуле найдем массу раствора ${subst}:</div><div class='formula'>m<sub>р-ра ${subst}</sub> = ρ<sub>р-ра ${subst}</sub> × V<sub>р-ра ${subst}</sub> = ${vars.ro_r} г/дм<sup>3</sup> × ${vars.V_r} дм<sup>3</sup> = ${vars.m_r} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('sol')} ${subst}</sub> = ρ<sub>${t('sol')} ${subst}</sub> × V<sub>${t('sol')} ${subst}</sub> = ${vars.ro_r} ${t('gdm')}<sup>3</sup> × ${vars.V_r} ${t('dm')}<sup>3</sup> = ${vars.m_r} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.formulaConnectingMPV')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_r2', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('sol')} ${subst}</sub> = ρ<sub>${t('sol')} ${subst}</sub> × V<sub>${t('sol')} ${subst}</sub> = ${vars.ro_r} ${t('gdm')}<sup>3</sup> × ${vars.V_r} ${t('dm')}<sup>3</sup> = ${vars.m_r} ${t('g')}`,
                  ],
                },
              ],
            };
          } else if (vars.w_v != undefined && vars.m_v != undefined) {
            vars.m_r = roundValue((vars.m_v * 100) / vars.w_v, 'm_r');
            step = {
              variable: 'm_r',
              dependencies: ['w_v', 'm_v'],
              value: vars.m_r,
              record: {
                ru: `<div class='formula'>ω<sub>в-ва</sub> = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>р-ра</sub></span></span> × 100%</div><div class='formula'>m<sub>р-ра ${subst}</sub> = <span class='fraction'><span class='top'>m<sub>в-ва ${subst}</sub></span><span class='bottom'>ω<sub>в-ва</sub>${substB}</span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v} г</span><span class='bottom'>${vars.w_v}%</span></span> × 100% = ${vars.m_r} г</div>`,
              },
              explanation: {
                ru: `<div>Так выглядит формула, связывающая массовую долю вещества (ω<sub>в-ва</sub>), массу вещества (m<sub>в-ва</sub>) и массу раствора (m<sub>р-ра</sub>):</div><div class='formula'>ω<sub>в-ва</sub> = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>р-ра</sub></span></span> × 100%</div><div>Из этой формулы выразим массу раствора ${subst}:</div><div class='formula'>m<sub>р-ра ${subst}</sub> = <span class='fraction'><span class='top'>m<sub>в-ва ${subst}</sub></span><span class='bottom'>ω<sub>в-ва</sub>${substB}</span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v} г</span><span class='bottom'>${vars.w_v}%</span></span> × 100% = ${vars.m_r} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω<sub>${t('subs')}</sub> = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('sol')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('sol')} ${subst}</sub> = `,
                    [`m<sub>${t('subs')} ${subst}</sub>`, `ω<sub>${t('subs')}</sub>${substB}`],
                    ` × 100% = `,
                    [`${vars.m_v} ${t('g')}`, `${vars.w_v}%`],
                    ` × 100% = ${vars.m_r} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.m_r3')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω<sub>${t('subs')}</sub> = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('sol')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_r4', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('sol')} ${subst}</sub> = `,
                    [`m<sub>${t('subs')} ${subst}</sub>`, `ω<sub>${t('subs')}</sub>${substB}`],
                    ` × 100% = `,
                    [`${vars.m_v} ${t('g')}`, `${vars.w_v}%`],
                    ` × 100% = ${vars.m_r} ${t('g')}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'm_smesi':
        if (vars.m_smesi == undefined) {
          if (vars.ro_smesi != undefined && vars.V_smesi != undefined) {
            vars.m_smesi = roundValue(vars.ro_smesi * vars.V_smesi, 'm_smesi');
            step = {
              variable: 'm_smesi',
              value: vars.m_smesi,
              dependencies: ['ro_smesi', 'V_smesi'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>m<sub>смеси ${subst}</sub> = ρ<sub>смеси ${subst}</sub> × V<sub>смеси ${subst}</sub> = ${vars.ro_smesi} г/дм<sup>3</sup> × ${vars.V_smesi} дм<sup>3</sup> = ${vars.m_smesi} г</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массу (m), плотность (ρ) и объём (V), записывается так:</div><div class='formula'>m = ρ × V</div><div>По этой формуле найдем массу смеси ${subst}:</div><div class='formula'>m<sub>смеси ${subst}</sub> = ρ<sub>смеси ${subst}</sub> × V<sub>смеси ${subst}</sub> = ${vars.ro_smesi} г/дм<sup>3</sup> × ${vars.V_smesi} дм<sup>3</sup> = ${vars.m_smesi} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('mix')} ${subst}</sub> = ρ<sub>${t('mix')} ${subst}</sub> × V<sub>${t('mix')} ${subst}</sub> = ${vars.ro_smesi} ${t('gdm')}<sup>3</sup> × ${vars.V_smesi} ${t('dm')}<sup>3</sup> = ${vars.m_smesi} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.formulaConnectingMPV')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_smesi2', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('mix')} ${subst}</sub> = ρ<sub>${t('mix')} ${subst}</sub> × V<sub>${t('mix')} ${subst}</sub> = ${vars.ro_smesi} ${t('gdm')}<sup>3</sup> × ${vars.V_smesi} ${t('dm')}<sup>3</sup> = ${vars.m_smesi} ${t('g')}`,
                  ],
                },
              ],
            };
          } else if (vars.w_v != undefined && vars.m_v != undefined) {
            vars.m_smesi = roundValue((vars.m_v * 100) / vars.w_v, 'm_r');
            step = {
              variable: 'm_smesi',
              dependencies: ['w_v', 'm_v'],
              value: vars.m_smesi,
              record: {
                ru: `<div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>смеси</sub></span></span> × 100%</div><div class='formula'>m<sub>смеси ${subst}</sub> = <span class='fraction'><span class='top'>m<sub>в-ва ${subst}</sub></span><span class='bottom'>ω${substB}</span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v} г</span><span class='bottom'>${vars.w_v}%</span></span> × 100% = ${vars.m_smesi} г</div>`,
              },
              explanation: {
                ru: `<div>Так выглядит формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу смеси (m<sub>смеси</sub>):</div><div class='formula'>ω = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>смеси</sub></span></span> × 100%</div><div>Из этой формулы выразим массу смеси ${subst}:</div><div class='formula'>m<sub>смеси ${subst}</sub> = <span class='fraction'><span class='top'>m<sub>в-ва ${subst}</sub></span><span class='bottom'>ω${substB}</span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v} г</span><span class='bottom'>${vars.w_v}%</span></span> × 100% = ${vars.m_smesi} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('mix')}</sub>`],
                    ' × 100%',
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('mix')} ${subst}</sub> = `,
                    [`m<sub>${t('subs')} ${subst}</sub>`, `ω${substB}`],
                    ` × 100% = `,
                    [`${vars.m_v} ${t('g')}`, `${vars.w_v}%`],
                    ` × 100% = ${vars.m_smesi} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.m_smesi3')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('mix')}</sub>`],
                    ' × 100%',
                  ],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_smesi4', subst)}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('mix')} ${subst}</sub> = `,
                    [`m<sub>${t('subs')} ${subst}</sub>`, `ω${substB}`],
                    ` × 100% = `,
                    [`${vars.m_v} ${t('g')}`, `${vars.w_v}%`],
                    ` × 100% = ${vars.m_smesi} ${t('g')}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'm_raspl':
        if (vars.m_raspl == undefined) {
          if (vars.ro_raspl != undefined && vars.V_raspl != undefined) {
            vars.m_raspl = roundValue(vars.ro_raspl * vars.V_raspl, 'm_raspl');
            step = {
              variable: 'm_raspl',
              value: vars.m_raspl,
              dependencies: ['ro_raspl', 'V_raspl'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>m<sub>распл. ${subst}</sub> = ρ<sub>распл. ${subst}</sub> × V<sub>распл. ${subst}</sub> = ${vars.ro_raspl} г/дм<sup>3</sup> × ${vars.V_raspl} дм<sup>3</sup> = ${vars.m_raspl} г</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массу (m), плотность (ρ) и объём (V), записывается так:</div><div class='formula'>m = ρ × V</div><div>По этой формуле найдем массу расплава ${subst}:</div><div class='formula'>m<sub>распл. ${subst}</sub> = ρ<sub>распл. ${subst}</sub> × V<sub>распл. ${subst}</sub> = ${vars.ro_raspl} г/дм<sup>3</sup> × ${vars.V_raspl} дм<sup>3</sup> = ${vars.m_raspl} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('melt')} ${subst}</sub> = ρ<sub>${t('melt')} ${subst}</sub> × V<sub>${t('melt')} ${subst}</sub> = ${vars.ro_raspl} ${t('gdm')}<sup>3</sup> × ${vars.V_raspl} ${t('dm')}<sup>3</sup> = ${vars.m_raspl} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.formulaConnectingMPV')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },

                {
                  type: 'text',
                  data: [`${t('taskSolver.m_raspl1', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('melt')} ${subst}</sub> = ρ<sub>${t('melt')} ${subst}</sub> × V<sub>${t('melt')} ${subst}</sub> = ${vars.ro_raspl} ${t('gdm')}<sup>3</sup> × ${vars.V_raspl} ${t('dm')}<sup>3</sup> = ${vars.m_raspl} ${t('g')}`,
                  ],
                },
              ],
            };
          } else if (vars.w_v != undefined && vars.m_v != undefined) {
            vars.m_raspl = roundValue((vars.m_v * 100) / vars.w_v, 'm_raspl');
            step = {
              variable: 'm_raspl',
              dependencies: ['w_v', 'm_v'],
              value: vars.m_raspl,
              record: {
                ru: `<div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>распл.</sub></span></span> × 100%</div><div class='formula'>m<sub>распл. ${subst}</sub> = <span class='fraction'><span class='top'>m<sub>в-ва ${subst}</sub></span><span class='bottom'>ω${substB}</span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v} г</span><span class='bottom'>${vars.w_v}%</span></span> × 100% = ${vars.m_raspl} г</div>`,
              },
              explanation: {
                ru: `<div>Так выглядит формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу расплава (m<sub>распл.</sub>):</div><div class='formula'>ω = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>распл.</sub></span></span> × 100%</div><div>Из этой формулы выразим массу расплава ${subst}:</div><div class='formula'>m<sub>распл. ${subst}</sub> = <span class='fraction'><span class='top'>m<sub>в-ва ${subst}</sub></span><span class='bottom'>ω${substB}</span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v} г</span><span class='bottom'>${vars.w_v}%</span></span> × 100% = ${vars.m_raspl} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('melt')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('melt')} ${subst}</sub> = `,
                    [`m<sub>${t('subs')} ${subst}</sub>`, `ω${substB}`],
                    ,
                    ` × 100% = `,
                    [`${vars.m_v} ${t('g')}`, `${vars.w_v}%`],
                    ` × 100% = ${vars.m_raspl} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.m_raspl2')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('melt')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_raspl3', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('melt')} ${subst}</sub> = `,
                    [`m<sub>${t('subs')} ${subst}</sub>`, `ω${substB}`],
                    ,
                    ` × 100% = `,
                    [`${vars.m_v} ${t('g')}`, `${vars.w_v}%`],
                    ` × 100% = ${vars.m_raspl} ${t('g')}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'm_rud':
        if (vars.m_rud == undefined) {
          if (vars.ro_rud != undefined && vars.V_rud != undefined) {
            vars.m_rud = roundValue(vars.ro_rud * vars.V_rud, 'm_rud');
            step = {
              variable: 'm_rud',
              value: vars.m_rud,
              dependencies: ['ro_rud', 'V_rud'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>m<sub>руды ${subst}</sub> = ρ<sub>руды ${subst}</sub> × V<sub>руды ${subst}</sub> = ${vars.ro_rud} г/дм<sup>3</sup> × ${vars.V_rud} дм<sup>3</sup> = ${vars.m_rud} г</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массу (m), плотность (ρ) и объём (V), записывается так:</div><div class='formula'>m = ρ × V</div><div>По этой формуле найдем массу руды ${subst}:</div><div class='formula'>m<sub>руды ${subst}</sub> = ρ<sub>руды ${subst}</sub> × V<sub>руды ${subst}</sub> = ${vars.ro_rud} г/дм<sup>3</sup> × ${vars.V_rud} дм<sup>3</sup> = ${vars.m_rud} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('ore')} ${subst}</sub> = ρ<sub>${t('ore')} ${subst}</sub> × V<sub>${t('ore')} ${subst}</sub> = ${vars.ro_rud} ${t('gdm')}<sup>3</sup> × ${vars.V_rud} ${t('dm')}<sup>3</sup> = ${vars.m_rud} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.formulaConnectingMPV')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_rud1', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('ore')} ${subst}</sub> = ρ<sub>${t('ore')} ${subst}</sub> × V<sub>${t('ore')} ${subst}</sub> = ${vars.ro_rud} ${t('gdm')}<sup>3</sup> × ${vars.V_rud} ${t('dm')}<sup>3</sup> = ${vars.m_rud} ${t('g')}`,
                  ],
                },
              ],
            };
          } else if (vars.w_v != undefined && vars.m_v != undefined) {
            vars.m_rud = roundValue((vars.m_v * 100) / vars.w_v, 'm_r');
            step = {
              variable: 'm_rud',
              dependencies: ['w_v', 'm_v'],
              value: vars.m_rud,
              record: {
                ru: `<div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>руды</sub></span></span> × 100%</div><div class='formula'>m<sub>руды ${subst}</sub> = <span class='fraction'><span class='top'>m<sub>в-ва ${subst}</sub></span><span class='bottom'>ω${substB}</span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v} г</span><span class='bottom'>${vars.w_v}%</span></span> × 100% = ${vars.m_rud} г</div>`,
              },
              explanation: {
                ru: `<div>Так выглядит формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу руды (m<sub>руды</sub>):</div><div class='formula'>ω = <span class='fraction'><span class='top'>m<sub>в-ва</sub></span><span class='bottom'>m<sub>руды</sub></span></span> × 100%</div><div>Из этой формулы выразим массу руды ${subst}:</div><div class='formula'>m<sub>руды ${subst}</sub> = <span class='fraction'><span class='top'>m<sub>в-ва ${subst}</sub></span><span class='bottom'>ω${substB}</span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v} г</span><span class='bottom'>${vars.w_v}%</span></span> × 100% = ${vars.m_rud} г</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('ore')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('ore')} ${subst}</sub> = `,
                    [`m<sub>${t('subs')} ${subst}</sub>`, `ω${substB}`],
                    ` × 100% = `,
                    [`${vars.m_v} ${t('g')}`, `${vars.w_v}%`],
                    ` × 100% = ${vars.m_rud} ${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.m_rud2')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('ore')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.m_rud3', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('ore')} ${subst}</sub> = `,
                    [`m<sub>${t('subs')} ${subst}</sub>`, `ω${substB}`],
                    ` × 100% = `,
                    [`${vars.m_v} ${t('g')}`, `${vars.w_v}%`],
                    ` × 100% = ${vars.m_rud} ${t('g')}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'n_v':
        if (vars.n_v == undefined) {
          if (vars.C_v != undefined && vars.V_r != undefined) {
            vars.n_v = roundValue(vars.C_v * vars.V_r, 'n_v');
            step = {
              variable: 'n_v',
              value: vars.n_v,
              dependencies: ['C_v', 'V_r'],
              record: {
                ru: `<div class='formula'>С = <span class='fraction'><span class='top'>n</span><span class='bottom'>V<sub>р-ра</sub></span></span></div><div class='formula'>n${substB} = С${substB} ×  V<sub>р-ра</sub>${substB} = ${vars.C_v} моль/дм<sup>3</sup> × ${vars.V_r} дм<sup>3</sup> = ${vars.n_v} моль</div>`,
              },
              explanation: {
                ru: `<div>Существует такая формула для нахождения молярной концентрации (С):</div><div class='formula'>С = <span class='fraction'><span class='top'>n</span><span class='bottom'>V<sub>р-ра</sub></span></span></div><div>Выразим из этой фомулы химическое количество (n) ${subst} и подставим в нее молярную концентрацию ${subst} (C) и объём раствора ${subst} (V<sub>р-ра</sub>):</div><div class='formula'>n${substB} = С${substB} ×  V<sub>р-ра</sub>${substB} = ${vars.C_v} моль/дм<sup>3</sup> × ${vars.V_r} дм<sup>3</sup> = ${vars.n_v} моль</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`С = `, [`n`, `V<sub>${t('sol')}</sub>`]],
                },
                {
                  type: 'formula',
                  data: [
                    `n${substB} = С${substB} ×  V<sub>${t('sol')}</sub>${substB} = ${vars.C_v} ${t('mole')}/${t('dm')}<sup>3</sup> × ${vars.V_r} ${t('dm')}<sup>3</sup> = ${vars.n_v} ${t('mole')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.n_v1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`С = `, [`n`, `V<sub>${t('sol')}</sub>`]],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.n_v2', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `n${substB} = С${substB} ×  V<sub>${t('sol')}</sub>${substB} = ${vars.C_v} ${t('mole')}/${t('dm')}<sup>3</sup> × ${vars.V_r} ${t('dm')}<sup>3</sup> = ${vars.n_v} ${t('mole')}`,
                  ],
                },
              ],
            };
          } else if (vars.m_v != undefined && vars.M_v != undefined) {
            vars.n_v = roundValue(vars.m_v / vars.M_v, 'm_r');
            step = {
              variable: 'n_v',
              value: vars.n_v,
              dependencies: ['m_v', 'M_v'],
              record: {
                ru: `<div class='formula'>n = <span class='fraction'><span class='top'>m</span><span class='bottom'>M</span></span></div><div class='formula'>n${substB} = <span class='fraction'><span class='top'>m${substB}</span><span class='bottom'>M${substB}</span></span> = <span class='fraction'><span class='top'>${vars.m_v} г</span><span class='bottom'>${vars.M_v} г/моль</span></span> = ${vars.n_v} моль</div>`,
              },
              explanation: {
                ru: `<div>Химическое количество находится по формуле:</div><div class='formula'>n = <span class='fraction'><span class='top'>m</span><span class='bottom'>M</span></span></div><div>Подставим в эту формулу массу ${subst} и молярную массу ${subst} и вычислим химическое количество:</div><div class='formula'>n${substB} = <span class='fraction'><span class='top'>m${substB}</span><span class='bottom'>M${substB}</span></span> = <span class='fraction'><span class='top'>${vars.m_v} г</span><span class='bottom'>${vars.M_v} г/моль</span></span> = ${vars.n_v} моль</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`n = `, [`m`, `M`]],
                },
                {
                  type: 'formula',
                  data: [
                    `n${substB} = `,
                    [`m${substB}`, `M${substB}`],
                    ` = `,
                    [`${vars.m_v} ${t('g')}`, `${vars.M_v} ${t('gmole')}`],
                    ` = ${vars.n_v} ${t('mole')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.n_v3')}`],
                },
                {
                  type: 'formula',
                  data: [`n = `, [`m`, `M`]],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.n_v4', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `n${substB} = `,
                    [`m${substB}`, `M${substB}`],
                    ` = `,
                    [`${vars.m_v} ${t('g')}`, `${vars.M_v} ${t('gmole')}`],
                    ` = ${vars.n_v} ${t('mole')}`,
                  ],
                },
              ],
            };
          } else if (vars.V_v != undefined && vars.V_n != undefined) {
            vars.n_v = roundValue(vars.V_v / vars.V_n, 'n_v');
            step = {
              variable: 'n_v',
              value: vars.n_v,
              dependencies: ['V_v', 'V_n'],
              record: {
                ru: `<div class='formula'>V<sub>n</sub> = <span class='fraction'><span class='top'>V</span><span class='bottom'>n</span></span></div><div class='formula'>n${substB} = <span class='fraction'><span class='top'>V${substB}</span><span class='bottom'>V<sub>n</sub> ${substB}</span></span> = <span class='fraction'><span class='top'>${vars.V_v} дм<sup>3</sup></span><span class='bottom'>${vars.V_n} дм<sup>3</sup>/моль</span></span> = ${vars.n_v} моль</div>`,
              },
              explanation: {
                ru: `<div>Таким образом записывается формула для нахождения молярного объема:</div><div class='formula'>V<sub>n</sub> = <span class='fraction'><span class='top'>V</span><span class='bottom'>n</span></span></div><div>Выразим из этого уравнения химическое количество (n) ${subst} и подставим молярный объем ${subst} (V<sub>n</sub>) и объем ${subst} (V):</div><div class='formula'>n${substB} = <span class='fraction'><span class='top'>V${substB}</span><span class='bottom'>V<sub>n</sub> ${substB}</span></span> = <span class='fraction'><span class='top'>${vars.V_v} дм<sup>3</sup></span><span class='bottom'>${vars.V_n} дм<sup>3</sup>/моль</span></span> = ${vars.n_v} моль</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`V<sub>n</sub> = `, [`V`, `n`]],
                },
                {
                  type: 'formula',
                  data: [
                    `n${substB} = `,
                    [`V${substB}`, `V<sub>n</sub> ${substB}`],
                    ` = `,
                    [
                      `${vars.V_v} ${t('dm')}<sup>3</sup>`,
                      `${vars.V_n} ${t('dm')}<sup>3</sup>/${t('mole')}`,
                    ],
                    ` = ${vars.n_v} ${t('mole')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.n_v5')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`V<sub>n</sub> = `, [`V`, `n`]],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.n_v6', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `n${substB} = `,
                    [`V${substB}`, `V<sub>n</sub> ${substB}`],
                    ` = `,
                    [
                      `${vars.V_v} ${t('dm')}<sup>3</sup>`,
                      `${vars.V_n} ${t('dm')}<sup>3</sup>/${t('mole')}`,
                    ],
                    ` = ${vars.n_v} ${t('mole')}`,
                  ],
                },
              ],
            };
          } else if (
            vars.V_v != undefined &&
            subst != '' &&
            gases.indexOf(subst) >= 0
          ) {
            vars.n_v = roundValue(vars.V_v / constants.V_m.value, 'n_v');
            step = {
              variable: 'n_v',
              dependencies: ['V_v'],
              value: vars.n_v,
              record: {
                ru: `<div class='formula'>V = V<sub>n</sub> × n</div><div class='formula'>n${substB} = <span class='fraction'><span class='top'>V${substB}</span><span class='bottom'>V<sub>n</sub></span></span> = <span class='fraction'><span class='top'>${vars.V_v} дм<sup>3</sup></span><span class='bottom'>${constants.V_m.record} дм<sup>3</sup>/моль</span></span> = ${vars.n_v} моль</div>`,
              },
              explanation: {
                ru: `<div>Объем газа находится по формуле:</div><div class='formula'>V = V<sub>n</sub> × n</div><div>Из этой формулы выразим химическое количество ${subst} (n) и подставим в нее объем ${subst} (V) и молярный объем газа при нормальных условиях (V<sub>n</sub>; это постоянная величина, которая равна 22,4 дм<sup>3</sup>):</div><div class='formula'>n${substB} = <span class='fraction'><span class='top'>V${substB}</span><span class='bottom'>V<sub>n</sub></span></span> = <span class='fraction'><span class='top'>${vars.V_v} дм<sup>3</sup></span><span class='bottom'>${constants.V_m.record} дм<sup>3</sup>/моль</span></span> = ${vars.n_v} моль</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`V = V<sub>n</sub> × n`],
                },
                {
                  type: 'formula',
                  data: [
                    `n${substB} = `,
                    [`V${substB}`, `V<sub>n</sub>`],
                    ` = `,
                    [
                      `${vars.V_v} ${t('dm')}<sup>3</sup>`,
                      `${constants.V_m.record} ${t('dm')}<sup>3</sup>/${t('mole')}`,
                    ],
                    ` = ${vars.n_v} ${t('mole')} = ${vars.n_v} ${t('mole')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.n_v7')}`],
                },
                {
                  type: 'formula',
                  data: [`V = V<sub>n</sub> × n`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.n_v8', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `n${substB} = `,
                    [`V${substB}`, `V<sub>n</sub>`],
                    ` = `,
                    [
                      `${vars.V_v} ${t('dm')}<sup>3</sup>`,
                      `${constants.V_m.record} ${t('dm')}<sup>3</sup>/mole`,
                    ],
                    ` = ${vars.n_v} ${t('mole')} = ${vars.n_v} mole`,
                  ],
                },
              ],
            };
          } else if (vars.N_v != undefined) {
            vars.n_v = roundValue(vars.N_v / constants.N_a.value, 'n_v');
            step = {
              variable: 'n_v',
              dependencies: ['N_v'],
              value: vars.n_v,
              record: {
                ru: `<div class='formula'>n = <span class='fraction'><span class='top'>N</span><span class='bottom'>N<sub>A</sub></span></span></div><div class='formula'>n${substB} = <span class='fraction'><span class='top'>N${substB}</span><span class='bottom'>N<sub>A</sub></span></span> = <span class='fraction'><span class='top'>${vars.N_v} </span><span class='bottom'>${constants.N_a.record} моль<sup>-1</sup></span></span> = ${vars.n_v} моль</div>`,
              },
              explanation: {
                ru: `<div>Химическое количество находится по формуле:</div><div class='formula'>n = <span class='fraction'><span class='top'>N</span><span class='bottom'>N<sub>A</sub></span></span></div><div>Подставим в эту формулу число структурных единиц ${subst} (N) и число Авогадро (N<sub>A</sub>; это постоянная величина, которая равна 6,02 × 10<sup>23</sup> моль<sup>-1</sup>) и вычислим химическое количество ${subst}:</div><div class='formula'>n${substB} = <span class='fraction'><span class='top'>N${substB}</span><span class='bottom'>N<sub>A</sub></span></span> = <span class='fraction'><span class='top'>${vars.N_v} </span><span class='bottom'>${constants.N_a.record} моль<sup>-1</sup></span></span> = ${vars.n_v} моль</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`n = `, [`N`, `N<sub>A</sub>`]],
                },
                {
                  type: 'formula',
                  data: [
                    `n${substB} = `,
                    [`N${substB}`, `N<sub>A</sub>`],
                    ` = `,
                    [
                      `${vars.N_v}`,
                      `${constants.N_a.record} ${t('mole')}<sup>-1</sup>`,
                    ],
                    ` = ${vars.n_v} ${t('mole')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.n_v9', {subst})}`],
                },
                {
                  type: 'formula',
                  data: [`n = `, [`N`, `N<sub>A</sub>`]],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.n_v10', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `n${substB} = `,
                    [`N${substB}`, `N<sub>A</sub>`],
                    ` = `,
                    [
                      `${vars.N_v}`,
                      `${constants.N_a.record} ${t('mole')}<sup>-1</sup>`,
                    ],
                    ` = ${vars.n_v} ${t('mole')}`,
                  ],
                },
              ],
            };
          } else if (
            vars.P != undefined &&
            vars.V_v != undefined &&
            vars.T != undefined
          ) {
            vars.n_v = roundValue(
              (vars.P * vars.V_v) / (constants.R.value * vars.T),
              'n_v',
            );
            step = {
              variable: 'n_v',
              dependencies: ['P', 'V_v', 'T'],
              value: vars.n_v,
              record: {
                ru: `<div class='formula'>P × V = n × R × T</div><div class='formula'>n${substB} = <span class='fraction'><span class='top'>P${substB} × V${substB}</span><span class='bottom'>R × T${substB}</span></span> = <span class='fraction'><span class='top'>${vars.P} кПа × ${vars.V_v} дм<sup>3</sup></span><span class='bottom'>${constants.R.record} Дж/(моль×K) × ${vars.T} К</span></span> = ${vars.n_v} моль</div>`,
              },
              explanation: {
                ru: `<div>Запишем уравнение Менделеева-Клапейрона:</div><div class='formula'>P × V = n × R × T</div><div>Выразим из этого уравнения химическое количество (n) ${subst} и подставим объем ${subst} (V), давление газа (P), его температуру (T), а также газовую постоянную (R; это постоянная величина, которая равна ${constants.R.record} Дж/(моль×K)):</div><div class='formula'>n${substB} = <span class='fraction'><span class='top'>P${substB} × V${substB}</span><span class='bottom'>R × T${substB}</span></span> = <span class='fraction'><span class='top'>${vars.P} кПа × ${vars.V_v} дм<sup>3</sup></span><span class='bottom'>${constants.R.record} Дж/(моль×K) × ${vars.T} К</span></span> = ${vars.n_v} моль</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`P × V = n × R × T`],
                },
                {
                  type: 'formula',
                  data: [
                    `n${substB} = `,
                    [`P${substB} × V${substB}`, `R × T${substB}`],
                    ` = `,
                    [
                      `${vars.P} ${t('kpa')} × ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                      `${constants.R.record} ${t('j')}/(${t('mole')}×${t('k')}) × ${vars.T} ${t('k')}`,
                    ],
                    ` = ${vars.n_v} ${t('mole')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.n_v11')}`],
                },
                {
                  type: 'formula',
                  data: [`P × V = n × R × T`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.n_v12', {subst, constants})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `n${substB} = `,
                    [`P${substB} × V${substB}`, `R × T${substB}`],
                    ` = `,
                    [
                      `${vars.P} ${t('kpa')} × ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                      `${constants.R.record} ${t('j')}/(${t('mole')}×${t('k')}) × ${vars.T} ${t('k')}`,
                    ],
                    ` = ${vars.n_v} ${t('mole')}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      /* Проверил до этой строчки */

      case 'V_v':
        if (vars.V_v == undefined) {
          if (vars.m_v != undefined && vars.ro_v != undefined) {
            vars.V_v = roundValue(vars.m_v / vars.ro_v, 'V_v');
            step = {
              variable: 'V_v',
              value: vars.V_v,
              dependencies: ['m_v', 'ro_v'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>V${substB} = <span class='fraction'><span class='top'>m${substB}</span><span class='bottom'>ρ${substB}</span></span> = <span class='fraction'><span class='top'>${vars.m_v} г</span><span class='bottom'>${vars.ro_v} г/дм<sup>3</sup></span></span> = ${vars.V_v} дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Для нахождения массы через объем и плотность существует такая формула:</div><div class='formula'>m = ρ × V</div><div>Из этой формулы выразим объем ${subst} (V) и вычислим его:</div><div class='formula'>V${substB} = <span class='fraction'><span class='top'>m${substB}</span><span class='bottom'>ρ${substB}</span></span> = <span class='fraction'><span class='top'>${vars.m_v} г</span><span class='bottom'>${vars.ro_v} г/дм<sup>3</sup></span></span> = ${vars.V_v} дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `V${substB} = `,
                    [`m${substB}`, `ρ${substB}`],
                    ` = `,
                    [`${vars.m_v} ${t('g')}`, `${vars.ro_v} ${t('gdm')}<sup>3</sup>`],
                    ` = ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_v1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_v2', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V${substB} = `,
                    [`m${substB}`, `ρ${substB}`],
                    ` = `,
                    [`${vars.m_v} ${t('g')}`, `${vars.ro_v} ${t('gdm')}<sup>3</sup>`],
                    ` = ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          } else if (
            vars.P != undefined &&
            vars.n_v != undefined &&
            vars.T != undefined
          ) {
            vars.V_v = roundValue(
              (vars.n_v * vars.T * constants.R.value) / vars.P,
              'V_v',
            );
            step = {
              variable: 'V_v',
              value: vars.V_v,
              dependencies: ['n_v', 'T', 'R'],
              record: {
                ru: `<div class='formula'>P × V = n × R × T</div><div class='formula'>V${substB} = <span class='fraction'><span class='top'>n ${substB} × R × T${substB}</span><span class='bottom'>P${substB}</span></span> = <span class='fraction'><span class='top'>${vars.n_v} моль × ${constants.R.record} Дж/(моль×K) × ${vars.T} К</span><span class='bottom'>${vars.P} кПа</span></span> = ${vars.V_v} дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Запишем уравнение Менделеева-Клапейрона:</div><div class='formula'>P × V = n × R × T</div><div>Выразим из этого уравнения объем (V) ${subst} и подставим химическое количество ${subst} (n), давление газа (P), его температуру (T), а также газовую постоянную (R; это постоянная величина, которая равна ${constants.R.record} Дж/(моль×K)):</div><div class='formula'>V${substB} = <span class='fraction'><span class='top'>n ${substB} × R × T${substB}</span><span class='bottom'>P${substB}</span></span> = <span class='fraction'><span class='top'>${vars.n_v} моль × ${constants.R.record} Дж/(моль×K) × ${vars.T} К</span><span class='bottom'>${vars.P} атм</span></span> = ${vars.V_v} дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`P × V = n × R × T`],
                },
                {
                  type: 'formula',
                  data: [
                    `V${substB} = `,
                    [`n ${substB} × R × T${substB}`, `P${substB}`],
                    ` = `,
                    [
                      `${vars.n_v} ${t('mole')} × ${constants.R.record} ${t('j')}/(${t('mole')}×${t('k')}) × ${vars.T} ${t('k')}`,
                      `${vars.P} ${t('kpa')}`,
                    ],
                    ` = ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.n_v11')}`],
                },
                {
                  type: 'formula',
                  data: [`P × V = n × R × T`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_v3', {subst, constants})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V${substB} = `,
                    [`n ${substB} × R × T${substB}`, `P${substB}`],
                    ` = `,
                    [
                      `${vars.n_v} ${t('mole')} × ${constants.R.record} ${t('j')}/(${t('mole')}×${t('k')}) × ${vars.T} ${t('k')}`,
                      `${vars.P} ${t('kpa')}`,
                    ],
                    ` = ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          } else if (
            vars.n_v != undefined &&
            subst != '' &&
            gases.indexOf(subst) >= 0
          ) {
            vars.V_v = roundValue(vars.n_v * constants.V_m.value, 'V_v');
            step = {
              variable: 'V_v',
              value: vars.V_v,
              dependencies: ['n_v'],
              record: {
                ru: `<div class='formula'>V = V<sub>n</sub> × n</div><div class='formula'>V${substB} = V<sub>n</sub> × n${substB} = ${constants.V_m.record}  дм<sup>3</sup>/моль × ${vars.n_v} моль</span></span> = ${vars.V_v} дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Объем газа находится по формуле:</div><div class='formula'>V = V<sub>n</sub> × n</div><div>Подставим в нее химическое количество ${subst} (n) и молярный объем газа при нормальных условиях (V<sub>n</sub>; это постоянная величина, которая равна 22,4 дм<sup>3</sup>):</div><div class='formula'>V${substB} = V<sub>n</sub> × n${substB} = ${constants.V_m.record}  дм<sup>3</sup>/моль × ${vars.n_v} моль</span></span> = ${vars.V_v} дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`V = V<sub>n</sub> × n`],
                },
                {
                  type: 'formula',
                  data: [
                    `V${substB} = V<sub>n</sub> × n${substB} = ${constants.V_m.record}  t('dm')}<sup>3</sup>/${t('mole')} × ${vars.n_v} ${t('mole')}</span></span> = ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.V_v4')}`],
                },
                {
                  type: 'formula',
                  data: [`V = V<sub>n</sub> × n`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_v5', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V${substB} = V<sub>n</sub> × n${substB} = ${constants.V_m.record}  ${t('dm')}<sup>3</sup>/${t('mole')} × ${vars.n_v} ${t('mole')}</span></span> = ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          } else if (vars.fi != undefined && vars.V_smesi != undefined) {
            vars.V_v = roundValue((vars.fi * vars.V_smesi) / 100, 'V_v');
            step = {
              variable: 'V_v',
              value: vars.V_v,
              dependencies: ['fi', 'V_r'],
              record: {
                ru: `<div class='formula'>φ = <span class='fraction'><span class='top'>V<sub>в-ва</sub></span><span class='bottom'>V<sub>смеси</sub></span></span> × 100%</div><div class='formula'>V<sub>в-ва</sub>${substB} = <span class='fraction'><span class='top'>V<sub>смеси</sub> × φ</span><span class='bottom'>100%</span></span> = <span class='fraction'><span class='top'>${vars.V_smesi} дм<sup>3</sup> × ${vars.fi}%</span><span class='bottom'>100%</span></span> = ${vars.V_v} дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Объемная доля газа (φ) показывает, какую часть общего объема смеси занимает данный газ, и находится по формуле:</div><div class='formula'>φ = <span class='fraction'><span class='top'>V<sub>в-ва</sub></span><span class='bottom'>V<sub>смеси</sub></span></span> × 100%</div><div>Отсюда выразим объем вещества (V<sub>в-ва</sub>) ${subst} и подставим объем смеси (V<sub>смеси</sub>) и объемную долю вещества в ней (φ):</div><div class='formula'>V<sub>в-ва</sub>${substB} = <span class='fraction'><span class='top'>V<sub>смеси</sub> × φ</span><span class='bottom'>100%</span></span> = <span class='fraction'><span class='top'>${vars.V_smesi} дм<sup>3</sup> × ${vars.fi}%</span><span class='bottom'>100%</span></span> = ${vars.V_v} дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `φ = `,
                    [`V<sub>${t('subs')}</sub>`, `V<sub>${t('mix')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('subs')}</sub>${substB} = `,
                    [`V<sub>${t('mix')}</sub> × φ`, `100%`],
                    ` = `,
                    [`${vars.V_smesi} ${t('dm')}<sup>3</sup> × ${vars.fi}%`, `100%`],
                    ` = ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_v6')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `φ = `,
                    [`V<sub>${t('subs')}</sub>`, `V<sub>${t('mix')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_v7', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('subs')}</sub>${substB} = `,
                    [`V<sub>${t('mix')}</sub> × φ`, `100%`],
                    ` = `,
                    [`${vars.V_smesi} ${t('dm')}<sup>3</sup> × ${vars.fi}%`, `100%`],
                    ` = ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          } else if (vars.V_n != undefined && vars.n_v != undefined) {
            vars.V_v = roundValue(vars.V_n * vars.n_v, 'V_v');
            step = {
              variable: 'V_v',
              value: vars.V_v,
              dependencies: ['n_v', 'V_n'],
              record: {
                ru: `<div class='formula'>V<sub>n</sub> = <span class='fraction'><span class='top'>V</span><span class='bottom'>n</span></span></div><div class='formula'>V${substB} = V<sub>n</sub>${substB} × n ${substB} = ${vars.V_n} дм<sup>3</sup>/моль × ${vars.n_v} моль = ${vars.V_v} дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Таким образом записывается формула для нахождения молярного объема:</div><div class='formula'>V<sub>n</sub> = <span class='fraction'><span class='top'>V</span><span class='bottom'>n</span></span></div><div>Выразим из этой формулы объем вещества (V) ${subst} и подставим молярный объем ${subst} (V<sub>n</sub>) и химическое количество ${subst} (n):</div><div class='formula'>V${substB} = V<sub>n</sub>${substB} × n ${substB} = ${vars.V_n} дм<sup>3</sup>/моль × ${vars.n_v} моль = ${vars.V_v} дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`V<sub>n</sub> = `, [`V`, `n`]],
                },
                {
                  type: 'formula',
                  data: [
                    `V${substB} = V<sub>n</sub>${substB} × n ${substB} = ${vars.V_n} ${t('dm')}<sup>3</sup>/${t('mole')} × ${vars.n_v} ${t('mole')} = ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_v8')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`V<sub>n</sub> = `, [`V`, `n`]],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_v9', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V${substB} = V<sub>n</sub>${substB} × n ${substB} = ${vars.V_n} ${t('dm')}<sup>3</sup>/${t('mole')} × ${vars.n_v} ${t('mole')} = ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'V_n':
        if (vars.V_n == undefined) {
          if (vars.n_v != undefined && vars.V_v != undefined) {
            vars.V_n = roundValue(vars.V_v / vars.n_v, 'V_n');
            step = {
              variable: 'V_n',
              value: vars.V_n,
              dependencies: ['V_v', 'n_v'],
              record: {
                ru: `<div class='formula'>V<sub>n</sub> = <span class='fraction'><span class='top'>V</span><span class='bottom'>n</span></span></div><div class='formula'>V<sub>n</sub>${substB} = <span class='fraction'><span class='top'>${vars.V_v} дм<sup>3</sup></span><span class='bottom'>${vars.n_v} моль</span></span> = ${vars.V_n} дм<sup>3</sup>/моль</div>`,
              },
              explanation: {
                ru: `<div>Таким образом записывается формула для нахождения молярного объема:</div><div class='formula'>V<sub>n</sub> = <span class='fraction'><span class='top'>V</span><span class='bottom'>n</span></span></div><div>Подставим в записанную формулу химическое количество (n) ${subst} и объем (V) ${subst}:</div><div class='formula'>V<sub>n</sub>${substB} = <span class='fraction'><span class='top'>${vars.V_v} дм<sup>3</sup></span><span class='bottom'>${vars.n_v} моль</span></span> = ${vars.V_n} дм<sup>3</sup>/моль</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`V<sub>n</sub> = `, [`V`, `n`]],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>n</sub>${substB} = `,
                    [`${vars.V_v} ${t('dm')}<sup>3</sup>`, `${vars.n_v} ${t('mole')}`],
                    ` = ${vars.V_n} ${t('dm')}<sup>3</sup>/моль`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_n1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`V<sub>n</sub> = `, [`V`, `n`]],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_n2', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>n</sub>${substB} = `,
                    [`${vars.V_v} ${t('dm')}<sup>3</sup>`, `${vars.n_v} ${t('mole')}`],
                    ` = ${vars.V_n} дм<sup>3</sup>/${t('mole')}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'V_r':
        if (vars.V_r == undefined) {
          if (vars.m_r != undefined && vars.ro_r != undefined) {
            vars.V_r = roundValue(vars.m_r / vars.ro_r, 'V_r');
            step = {
              variable: 'V_r',
              value: vars.V_r,
              dependencies: ['m_r', 'ro_r'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>V<sub>р-ра</sub>${substB} = <span class='fraction'><span class='top'>m<sub>р-ра</sub>${substB}</span><span class='bottom'>ρ<sub>р-ра</sub>${substB}</span></span> = <span class='fraction'><span class='top'>${vars.m_r} г</span><span class='bottom'>${vars.ro_r} г/дм<sup>3</sup></span></span> = ${vars.V_r} дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Для нахождения массы через объем и плотность существует такая формула:</div><div class='formula'>m = ρ × V</div><div>Из этой формулы выразим объем раствора ${subst} (V<sub>р-ра</sub>) и вычислим его:</div><div class='formula'>V<sub>р-ра</sub>${substB} = <span class='fraction'><span class='top'>m<sub>р-ра</sub>${substB}</span><span class='bottom'>ρ<sub>р-ра</sub>${substB}</span></span> = <span class='fraction'><span class='top'>${vars.m_r} г</span><span class='bottom'>${vars.ro_r} г/дм<sup>3</sup></span></span> = ${vars.V_r} дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('sol')}</sub>${substB} = `,
                    [`m<sub>${t('sol')}</sub>${substB}`, `ρ<sub>${t('sol')}</sub>${substB}`],
                    ` = `,
                    [`${vars.m_r} г`, `${vars.ro_r} ${t('gdm')}<sup>3</sup>`],
                    ` = ${vars.V_r} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_r1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_r2', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('sol')}</sub>${substB} = `,
                    [`m<sub>${t('sol')}</sub>${substB}`, `ρ<sub>${t('sol')}</sub>${substB}`],
                    ` = `,
                    [`${vars.m_r} ${t('g')}`, `${vars.ro_r} ${t('gdm')}<sup>3</sup>`],
                    ` = ${vars.V_r} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          } else if (vars.n_v != undefined && vars.C_v != undefined) {
            vars.V_r = roundValue(vars.n_v / vars.C_v, 'V_r');
            step = {
              variable: 'V_r',
              value: vars.V_r,
              dependencies: ['C_v', 'n_v'],
              record: {
                ru: `<div class='formula'>С = <span class='fraction'><span class='top'>n</span><span class='bottom'>V<sub>р-ра</sub></span></span></div><div class='formula'>V<sub>р-ра</sub> ${substB} = <span class='fraction'><span class='top'>n${substB}</span><span class='bottom'>C${substB}</span></span> = <span class='fraction'><span class='top'>${vars.n_v} моль</span><span class='bottom'>${vars.C_v} моль/дм<sup>3</sup></span></span> = ${vars.V_r} дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Есть такая формула для нахождения молярной концентрации (С):</div><div class='formula'>С = <span class='fraction'><span class='top'>n</span><span class='bottom'>V<sub>р-ра</sub></span></span></div><div>Из этой формулы выразим объем раствора (V<sub>р-ра</sub>) ${subst}:</div><div class='formula'>V<sub>р-ра</sub> ${substB} = <span class='fraction'><span class='top'>n${substB}</span><span class='bottom'>C${substB}</span></span> = <span class='fraction'><span class='top'>${vars.n_v} моль</span><span class='bottom'>${vars.C_v} моль/дм<sup>3</sup></span></span> = ${vars.V_r} дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`С = `, [`n`, `V<sub>${t('sol')}</sub>`]],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('sol')}</sub> ${substB} = `,
                    [`n${substB}`, `C${substB}`],
                    ` = `,
                    [`${vars.n_v} ${t('mole')}`, `${vars.C_v} ${t('mole')}/${t('dm')}<sup>3</sup>`],
                    ` = ${vars.V_r} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_r3')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`С = `, [`n`, `V<sub>р-ра</sub>`]],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_r4', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('sol')}</sub> ${substB} = `,
                    [`n${substB}`, `C${substB}`],
                    ` = `,
                    [`${vars.n_v} ${t('mole')}`, `${vars.C_v} ${t('mole')}/${t('dm')}<sup>3</sup>`],
                    ` = ${vars.V_r} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          }
          // здесь еще было фи, но оно для смесей

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'V_smesi':
        if (vars.V_smesi == undefined) {
          if (vars.m_smesi != undefined && vars.ro_smesi != undefined) {
            vars.V_smesi = roundValue(vars.m_smesi / vars.ro_smesi, 'V_smesi');
            step = {
              variable: 'V_smesi',
              value: vars.V_smesi,
              dependencies: ['m_smesi', 'ro_smesi'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>V<sub>смеси</sub> = <span class='fraction'><span class='top'>m<sub>смеси</sub></span><span class='bottom'>ρ<sub>смеси</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_smesi} г</span><span class='bottom'>${vars.ro_smesi} г/дм<sup>3</sup></span></span> = ${vars.V_smesi} дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Для нахождения массы через объем и плотность существует такая формула:</div><div class='formula'>m = ρ × V</div><div>Из этой формулы выразим объем смеси (V<sub>смеси</sub>) и вычислим его:</div><div class='formula'>V<sub>смеси</sub> = <span class='fraction'><span class='top'>m<sub>смеси</sub></span><span class='bottom'>ρ<sub>смеси</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_smesi} г</span><span class='bottom'>${vars.ro_smesi} г/дм<sup>3</sup></span></span> = ${vars.V_smesi} дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('mix')}</sub> = `,
                    [`m<sub>${t('mix')}</sub>`, `ρ<sub>${t('mix')}</sub>`],
                    ` = `,
                    [`${vars.m_smesi} ${t('g')}`, `${vars.ro_smesi} ${t('gdm')}<sup>3</sup>`],
                    ` = ${vars.V_smesi} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_smesi1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_smesi2')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('mix')}</sub> = `,
                    [`m<sub>${t('mix')}</sub>`, `ρ<sub>${t('mix')}</sub>`],
                    ` = `,
                    [`${vars.m_smesi} ${t('g')}`, `${vars.ro_smesi} ${t('gdm')}<sup>3</sup>`],
                    ` = ${vars.V_smesi} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          } else if (vars.V_v != undefined && vars.fi != undefined) {
            vars.V_smesi = roundValue((vars.V_v / vars.fi) * 100, 'V_smesi');
            step = {
              variable: 'V_smesi',
              value: vars.V_smesi,
              dependencies: ['V_v', 'fi'],
              record: {
                ru: `<div class='formula'>φ = <span class='fraction'><span class='top'>V<sub>в-ва</sub></span><span class='bottom'>V<sub>смеси</sub></span></span> × 100%</div><div class='formula'>V<sub>смеси</sub> = <span class='fraction'><span class='top'>V<sub>в-ва</sub>${substB}</span><span class='bottom'>φ${substB}</span></span> × 100% = <span class='fraction'><span class='top'>${vars.V_v} дм<sup>3</sup></span><span class='bottom'>${vars.fi}%</span></span> × 100% = ${vars.V_smesi} дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Объемная доля газа (φ) показывает, какую часть общего объема смеси занимает данный газ, и находится по формуле:</div><div class='formula'>φ = <span class='fraction'><span class='top'>V<sub>в-ва</sub></span><span class='bottom'>V<sub>смеси</sub></span></span> × 100%</div><div>Отсюда выразим объем смеси (V<sub>смеси</sub>) ${subst} и подставим объем вещества ${subst} (V<sub>в-ва</sub>) и объемную долю вещества ${subst} (φ) в этой смеси:</div><div class='formula'>V<sub>смеси</sub> = <span class='fraction'><span class='top'>V<sub>в-ва</sub>${substB}</span><span class='bottom'>φ${substB}</span></span> × 100% = <span class='fraction'><span class='top'>${vars.V_v} дм<sup>3</sup></span><span class='bottom'>${vars.fi}%</span></span> × 100% = ${vars.V_smesi} дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `φ = `,
                    [`V<sub>${t('subs')}</sub>`, `V<sub>${t('mix')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>смеси</sub> = `,
                    [`V<sub>${t('subs')}</sub>${substB}`, `φ${substB}`],
                    ` × 100% = `,
                    [`${vars.V_v} ${t('dm')}<sup>3</sup>`, `${vars.fi}%`],
                    ` × 100% = ${vars.V_smesi} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_smesi3')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `φ = `,
                    [`V<sub>${t('subs')}</sub>`, `V<sub>${t('mix')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_smesi4', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('mix')}</sub> = `,
                    [`V<sub>${t('subs')}</sub>${substB}`, `φ${substB}`],
                    ` × 100% = `,
                    [`${vars.V_v} ${t('dm')}<sup>3</sup>`, `${vars.fi}%`],
                    ` × 100% = ${vars.V_smesi} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'V_raspl':
        if (vars.V_raspl == undefined) {
          if (vars.m_raspl != undefined && vars.ro_raspl != undefined) {
            vars.V_raspl = roundValue(vars.m_raspl / vars.ro_raspl, 'V_raspl');
            step = {
              variable: 'V_raspl',
              value: vars.V_raspl,
              dependencies: ['m_raspl', 'ro_raspl'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>V<sub>${raspl}</sub> = <span class='fraction'><span class='top'>m<sub>${raspl}</sub></span><span class='bottom'>ρ<sub>${raspl}</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_raspl}${g}</span><span class='bottom'>${vars.ro_raspl}${g}/дм<sup>3</sup></span></span> = ${vars.V_raspl} дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Для нахождения массы через объем и плотность существует такая формула:</div><div class='formula'>m = ρ × V</div><div>Из этой формулы выразим объем расплава (V<sub>${raspl}</sub>) и вычислим его:</div><div class='formula'>V<sub>${raspl}</sub> = <span class='fraction'><span class='top'>m<sub>${raspl}</sub></span><span class='bottom'>ρ<sub>${raspl}</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_raspl}${g}</span><span class='bottom'>${vars.ro_raspl}${g}/дм<sup>3</sup></span></span> = ${vars.V_raspl} дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('melt')}</sub> = `,
                    [`m<sub>${t('melt')}</sub>`, `ρ<sub>${t('dm')}</sub>`],
                    ` = `,
                    [
                      `${vars.m_raspl}${t('g')}`,
                      `${vars.ro_raspl}${t('g')}/${t('dm')}<sup>3</sup>`,
                    ],
                    ` = ${vars.V_raspl} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_raspl1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_raspl2')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('melt')}</sub> = `,
                    [`m<sub>${t('melt')}</sub>`, `ρ<sub>${t('melt')}</sub>`],
                    ` = `,
                    [
                      `${vars.m_raspl}${t('g')}`,
                      `${vars.ro_raspl}${t('g')}/${t('dm')}<sup>3</sup>`,
                    ],
                    ` = ${vars.V_raspl} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'V_rud':
        if (vars.V_rud == undefined) {
          if (vars.m_rud != undefined && vars.ro_rud != undefined) {
            vars.V_rud = roundValue(vars.m_rud / vars.ro_rud, 'V_rud');
            step = {
              variable: 'V_rud',
              value: vars.V_rud,
              dependencies: ['m_rud', 'ro_rud'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>V<sub>${rud}</sub> = <span class='fraction'><span class='top'>m<sub>${rud}</sub></span><span class='bottom'>ρ<sub>${rud}</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_rud}${g}</span><span class='bottom'>${vars.ro_rud}${g}/дм<sup>3</sup></span></span> = ${vars.V_rud} дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Для нахождения массы через объем и плотность существует такая формула:</div><div class='formula'>m = ρ × V</div><div>Из этой формулы выразим объем руды (V<sub>${rud}</sub>) и вычислим его:</div><div class='formula'>V<sub>${rud}</sub> = <span class='fraction'><span class='top'>m<sub>${rud}</sub></span><span class='bottom'>ρ<sub>${rud}</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_rud}${g}</span><span class='bottom'>${vars.ro_rud}${g}/дм<sup>3</sup></span></span> = ${vars.V_rud} дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('ore')}</sub> = `,
                    [`m<sub>${t('ore')}</sub>`, `ρ<sub>${t('ore')}</sub>`],
                    ` = `,
                    [`${vars.m_rud}${t('g')}`, `${vars.ro_rud}${t('g')}/${t('dm')}<sup>3</sup>`],
                    ` = ${vars.V_rud} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_rud1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_rud2')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `V<sub>${t('ore')}</sub> = `,
                    [`m<sub>${t('ore')}</sub>`, `ρ<sub>${t('ore')}</sub>`],
                    ` = `,
                    [`${vars.m_rud}${t('g')}`, `${vars.ro_rud}${t('g')}/${t('dm')}<sup>3</sup>`],
                    ` = ${vars.V_rud} ${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'w_v':
        if (vars.w_v == undefined) {
          if (vars.m_r != undefined && vars.m_v != undefined) {
            vars.w_v = roundValue((vars.m_v / vars.m_r) * 100, 'w_v');
            step = {
              variable: 'w_v',
              value: vars.w_v,
              dependencies: ['m_v', 'm_r'],
              record: {
                ru: `<div class='formula'>ω = <span class='fraction'><span class='top'>m<sub>${sub}</sub></span><span class='bottom'>m<sub>${rra}</sub></span></span> × 100%</div><div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>${sub}</sub>${substB}</span><span class='bottom'>m<sub>${rra}</sub>${substB}</span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.m_r}${g}</span></span> = ${vars.w_v}%</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>${sub}</sub>) и массу раствора (m<sub>${rra}</sub>), записывается так:</div><div class='formula'>ω = <span class='fraction'><span class='top'>m<sub>${sub}</sub></span><span class='bottom'>m<sub>${rra}</sub></span></span> × 100%</div><div>Подставим массу вещества ${subst} и массу его раствора и найдем массовую долю (ω):</div><div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>${sub}</sub>${substB}</span><span class='bottom'>m<sub>${rra}</sub>${substB}</span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.m_r}${g}</span></span> = ${vars.w_v}%</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('sol')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [
                      `m<sub>${t('subs')}</sub>${substB}`,
                      `m<sub>${t('sol')}</sub>${substB}`,
                    ],
                    ` × 100% = `,
                    [`${vars.m_v}${t('g')}`, `${vars.m_r}${t('g')}`],
                    ` = ${vars.w_v}%`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.w_v1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('sol')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.w_v2', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [
                      `m<sub>${t('subs')}</sub>${substB}`,
                      `m<sub>${t('sol')}</sub>${substB}`,
                    ],
                    ` × 100% = `,
                    [`${vars.m_v}${t('g')}`, `${vars.m_r}${t('g')}`],
                    ` = ${vars.w_v}%`,
                  ],
                },
              ],
            };
          } else if (vars.m_raspl != undefined && vars.m_v != undefined) {
            vars.w_v = roundValue((vars.m_v / vars.m_raspl) * 100, 'w_v');
            step = {
              variable: 'w_v',
              value: vars.w_v,
              dependencies: ['m_v', 'm_raspl'],
              record: {
                ru: `<div class='formula'>ω = <span class='fraction'><span class='top'>m<sub>${sub}</sub></span><span class='bottom'>m<sub>${raspl}</sub></span></span> × 100%</div><div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>${sub}</sub>${substB}</span><span class='bottom'>m<sub>${raspl}</sub></span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.m_raspl}${g}</span></span> = ${vars.w_v}%</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>${sub}</sub>) и массу распплава (m<sub>${raspl}</sub>), записывается так:</div><div class='formula'>ω = <span class='fraction'><span class='top'>m<sub>${sub}</sub></span><span class='bottom'>m<sub>
                </sub></span></span> × 100%</div><div>Подставим массу вещества ${subst} и массу расплава и найдем массовую долю (ω):</div><div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>${sub}</sub>${substB}</span><span class='bottom'>m<sub>${raspl}</sub></span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.m_raspl}${g}</span></span> = ${vars.w_v}%</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('melt')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>${substB}`, `m<sub>${t('melt')}</sub>`],
                    ` × 100% = `,
                    [`${vars.m_v}${t('g')}`, `${vars.m_raspl}${t('g')}`],
                    ` = ${vars.w_v}%`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.w_v3')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('melt')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.w_v4', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>${substB}`, `m<sub>${t('melt')}</sub>`],
                    ` × 100% = `,
                    [`${vars.m_v}${t('g')}`, `${vars.m_raspl}${t('g')}`],
                    ` = ${vars.w_v}%`,
                  ],
                },
              ],
            };
          } else if (vars.m_rud != undefined && vars.m_v != undefined) {
            vars.w_v = roundValue((vars.m_v / vars.m_rud) * 100, 'w_v');
            step = {
              variable: 'w_v',
              value: vars.w_v,
              dependencies: ['m_v', 'm_rud'],
              record: {
                ru: `<div class='formula'>ω = <span class='fraction'><span class='top'>m<sub>${sub}</sub></span><span class='bottom'>m<sub>${rud}</sub></span></span> × 100%</div><div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>${sub}</sub>${substB}</span><span class='bottom'>m<sub>${rud}</sub></span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.m_rud}${g}</span></span> = ${vars.w_v}%</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>${sub}</sub>) и массу ${rud} (m<sub>${rud}</sub>), записывается так:</div><div class='formula'>ω = <span class='fraction'><span class='top'>m<sub>${sub}</sub></span><span class='bottom'>m<sub>${rud}</sub></span></span> × 100%</div><div>Подставим массу вещества ${subst} и массу ${rud} и найдем массовую долю (ω):</div><div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>${sub}</sub>${substB}</span><span class='bottom'>m<sub>${rud}</sub></span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.m_rud}${g}</span></span> = ${vars.w_v}%</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('ore')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>${substB}`, `m<sub>${t('ore')}</sub>`],
                    ` × 100% = `,
                    [`${vars.m_v}${t('g')}`, `${vars.m_rud}${t('g')}`],
                    ` = ${vars.w_v}%`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.w_v5')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('ore')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.w_v6', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>${substB}`, `m<sub>${t('ore')}</sub>`],
                    ` × 100% = `,
                    [`${vars.m_v}${t('g')}`, `${vars.m_rud}${t('g')}`],
                    ` = ${vars.w_v}%`,
                  ],
                },
              ],
            };
          } else if (vars.m_smesi != undefined && vars.m_v != undefined) {
            vars.w_v = roundValue((vars.m_v / vars.m_smesi) * 100, 'w_v');
            step = {
              variable: 'w_v',
              value: vars.w_v,
              dependencies: ['m_v', 'm_smesi'],
              record: {
                ru: `<div class='formula'>ω = <span class='fraction'><span class='top'>m<sub>${sub}</sub></span><span class='bottom'>m<sub>${mix}</sub></span></span> × 100%</div><div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>${sub}</sub>${substB}</span><span class='bottom'>m<sub>${mix}</sub></span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.m_smesi}${g}</span></span> = ${vars.w_v}%</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>${sub}</sub>) и массу ${mix} (m<sub>${mix}</sub>), 
                  'записывается так',
                :</div><div class='formula'>ω = <span class='fraction'><span class='top'>m<sub>${sub}</sub></span><span class='bottom'>m<sub>${mix}</sub></span></span> × 100%</div><div>Подставим массу вещества ${subst} 
                  'и массу',
                 ${mix} и найдем массовую долю (ω):</div><div class='formula'>ω${substB} = <span class='fraction'><span class='top'>m<sub>${sub}</sub>${substB}</span><span class='bottom'>m<sub>${mix}</sub></span></span> × 100% = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.m_smesi}${g}</span></span> = ${vars.w_v}%</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('mix')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>${substB}`, `m<sub>${t('mix')}</sub>`],
                    ` × 100% = `,
                    [`${vars.m_v}${t('g')}`, `${vars.m_smesi}${t('g')}`],
                    ` = ${vars.w_v}%`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.w_v7')}`],
                },
                {
                  type: 'formula',
                  data: [
                    `ω = `,
                    [`m<sub>${t('subs')}</sub>`, `m<sub>${t('mix')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.w_v8', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω${substB} = `,
                    [`m<sub>${t('subs')}</sub>${substB}`, `m<sub>${t('mix')}</sub>`],
                    ` × 100% = `,
                    [`${vars.m_v}${t('g')}`, `${vars.m_smesi}${t('g')}`],
                    ` = ${vars.w_v}%`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'w_vyh':
        if (vars.w_vyh == undefined) {
          if (vars.m_pract != undefined && vars.m_teor != undefined) {
            vars.w_vyh = roundValue(
              (vars.m_pract / vars.m_teor) * 100,
              'w_vyh',
            );
            step = {
              variable: 'w_vyh',
              value: vars.w_vyh,
              dependencies: ['m_pract', 'm_teor'],
              record: {
                ru: `<div class='formula'>ω<sub>${vih}</sub> = <span class='fraction'><span class='top'>m<sub>${prakt}</sub></span><span class='bottom'>m<sub>${teor}</sub></span></span> * 100%</div><div class='formula'>ω<sub>${vih}</sub> = <span class='fraction'><span class='top'>${vars.m_pract}${g}</span><span class='bottom'>${vars.m_teor}${g}</span></span> = ${vars.w_vyh}%</div>`,
              },
              explanation: {
                ru: `<div>Массовая доля выхода (или выход, обозначается как ω<sub>${vih}</sub>) - это отношение реальной массы вещества на выходе к теоретически возможной. Находится ω<sub>${vih}</sub> по формуле:</div><div class='formula'>ω<sub>${vih}</sub> = <span class='fraction'><span class='top'>m<sub>${prakt}</sub></span><span class='bottom'>m<sub>${teor}</sub></span></span> * 100%</div><div>Подставим практическую массу и теоретическую в формулу и посчитаем ω<sub>${vih}</sub>:</div><div class='formula'>ω<sub>${vih}</sub> = <span class='fraction'><span class='top'>${vars.m_pract}${g}</span><span class='bottom'>${vars.m_teor}${g}</span></span> = ${vars.w_vyh}%</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `ω<sub>${t('yield')}</sub> = `,
                    [`m<sub>${t('pract')}</sub>`, `m<sub>${t('theor')}</sub>`],
                    ` * 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω<sub>${t('yield')}</sub> = `,
                    [`${vars.m_pract}${t('g')}`, `${vars.m_teor}${t('g')}`],
                    ` = ${vars.w_vyh}%`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.w_vyh1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω<sub>${t('yield')}</sub> = `,
                    [`m<sub>${t('pract')}</sub>`, `m<sub>${t('theor')}</sub>`],
                    ` * 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.w_vyh2')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ω<sub>${t('yield')}</sub> = `,
                    [`${vars.m_pract}${t('g')}`, `${vars.m_teor}${t('g')}`],
                    ` = ${vars.w_vyh}%`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'fi':
        if (vars.fi == undefined) {
          if (vars.V_v != undefined && vars.V_smesi != undefined) {
            vars.fi = roundValue((vars.V_v / vars.V_smesi) * 100, 'fi');
            step = {
              variable: 'fi',
              value: vars.fi,
              dependencies: ['V_v', 'V_smesi'],
              record: {
                ru: `<div class='formula'>φ = <span class='fraction'><span class='top'>V<sub>${sub}</sub></span><span class='bottom'>V<sub>${mix}</sub></span></span> × 100%</div><div class='formula'>φ${substB} = <span class='fraction'><span class='top'>${vars.V_v} дм<sup>3</sup></sub></span><span class='bottom'>${vars.V_smesi} дм<sup>3</sup></sub></span></span> × 100% = ${vars.fi} %</div>`,
              },
              explanation: {
                ru: `<div>Объемная доля газа (φ) показывает, какую часть общего объема ${mix} занимает данный газ, и находится по формуле:</div><div class='formula'>φ = <span class='fraction'><span class='top'>V<sub>${sub}</sub></span><span class='bottom'>V<sub>${mix}</sub></span></span> × 100%</div><div>Посчитаем по этой формуле объемную долю газа (φ):</div><div class='formula'>φ${substB} = <span class='fraction'><span class='top'>${vars.V_v} дм<sup>3</sup></sub></span><span class='bottom'>${vars.V_smesi} дм<sup>3</sup></sub></span></span> × 100% = ${vars.fi} %</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `φ = `,
                    [`V<sub>${t('subs')}</sub>`, `V<sub>${t('mix')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `φ${substB} = `,
                    [
                      `${vars.V_v} ${t('dm')}<sup>3</sup>`,
                      `${vars.V_smesi} ${t('dm')}<sup>3</sup>`,
                    ],
                    ` × 100% = ${vars.fi} %`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.fi1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `φ = `,
                    [`V<sub>${t('subs')}</sub>`, `V<sub>${t('mix')}</sub>`],
                    ` × 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.fi2')}`],
                },
                {
                  type: 'formula',
                  data: [
                    `φ${substB} = `,
                    [
                      `${vars.V_v} ${t('dm')}<sup>3</sup>`,
                      `${vars.V_smesi} ${t('dm')}<sup>3</sup>`,
                    ],
                    ` × 100% = ${vars.fi} %`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'fi_vyh':
        if (vars.fi_vyh == undefined) {
          if (vars.V_pract != undefined && vars.V_teor != undefined) {
            vars.fi_vyh = roundValue(
              (vars.V_pract / vars.V_teor) * 100,
              'fi_vyh',
            );
            step = {
              variable: 'fi_vyh',
              value: vars.fi_vyh,
              dependencies: ['V_pract', 'V_teor'],
              record: {
                ru: `<div class='formula'>φ<sub>${vih}</sub> = <span class='fraction'><span class='top'>V<sub>${prakt}</sub></span><span class='bottom'>V<sub>${teor}</sub></span></span> * 100%</div><div class='formula'>φ<sub>${vih}</sub> = <span class='fraction'><span class='top'>${vars.V_pract} дм<sup>3</sup></span><span class='bottom'>${vars.V_teor} дм<sup>3</sup><</span></span> = ${vars.fi_vyh}%</div>`,
              },
              explanation: {
                ru: `<div>Объемная доля выхода (обозначается как φ<sub>${vih}</sub>) - это отношение реального объема на выходе к теоретически возможному. Находится φ<sub>${vih}</sub> по формуле:</div><div class='formula'>φ<sub>${vih}</sub> = <span class='fraction'><span class='top'>V<sub>${prakt}</sub></span><span class='bottom'>V<sub>${teor}</sub></span></span> * 100%</div><div>Подставим практический объем и теоретический в формулу и посчитаем φ<sub>${vih}</sub>:</div><div class='formula'>φ<sub>${vih}</sub> = <span class='fraction'><span class='top'>${vars.V_pract} дм<sup>3</sup></span><span class='bottom'>${vars.V_teor} дм<sup>3</sup><</span></span> = ${vars.fi_vyh}%</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `φ<sub>$${t('yield')}</sub> = `,
                    [`V<sub>${t('pract')}</sub>`, `V<sub>${t('theor')}</sub>`],
                    ` * 100%`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `φ<sub>${t('yield')}</sub> = `,
                    [
                      `${vars.V_pract} ${t('dm')}<sup>3</sup>`,
                      `${vars.V_teor} ${t('dm')}<sup>3</sup>`,
                    ],
                    ` = ${vars.fi_vyh}%`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.fi_vyh1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `φ<sub>${t('g')}</sub> = `,
                    [`V<sub>${t('pract')}</sub>`, `V<sub>${t('theor')}</sub>`],
                    ` * 100%`,
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.fi_vyh2')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `φ<sub>$${t('yield')}</sub> = `,
                    [
                      `${vars.V_pract} ${t('dm')}<sup>3</sup>`,
                      `${vars.V_teor} ${t('dm')}<sup>3</sup>`,
                    ],
                    ` = ${vars.fi_vyh}%`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'ro_v':
        if (vars.ro_v == undefined) {
          if (vars.m_v != undefined && vars.V_v != undefined) {
            vars.ro_v = roundValue(vars.m_v / vars.V_v, 'ro_v');
            step = {
              variable: 'ro_v',
              value: vars.ro_v,
              dependencies: ['m_v', 'V_v'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>ρ${substB} = <span class='fraction'><span class='top'>m${substB}</span><span class='bottom'>V${substB}</span></span> = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.V_v} дм<sup>3</sup></span></span> = ${vars.ro_v}${g}/дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Для нахождения массы через объем и плотность существует такая формула:</div><div class='formula'>m = ρ × V</div><div>Из этой формулы выразим плотность ${subst} (ρ) и вычислим ее:</div><div class='formula'>ρ${substB} = <span class='fraction'><span class='top'>m${substB}</span><span class='bottom'>V${substB}</span></span> = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.V_v} дм<sup>3</sup></span></span> = ${vars.ro_v}${g}/дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `ρ${substB} = `,
                    [`m${substB}`, `V${substB}`],
                    ` = `,
                    [`${vars.m_v}${t('g')}`, `${vars.V_v} ${t('dm')}<sup>3</sup>`],
                    ` = ${vars.ro_v}${t('gdm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.ro_v1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.ro_v2', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ρ${substB} = `,
                    [`m${substB}`, `V${substB}`],
                    ` = `,
                    [`${vars.m_v}${t('g')}`, `${vars.V_v} ${t('dm')}<sup>3</sup>`],
                    ` = ${vars.ro_v}${t('gdm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          } else if (subst == 'H2O') {
            vars.ro_v = constants.ro_h2o.value;
            step = {
              variable: 'ro_v',
              value: vars.ro_v,
              dependencies: [],
              record: {
                ru: `<div>ρ(H<sub>2</sub>O) = ${constants.ro_h2o.record}${g}/дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Плотность воды - величина всем известная, поэтому не так важно, что в условии о ней ничего не сказано. Плотность воды равна ${constants.ro_h2o.record}${g}/дм<sup>3</sup>.</div><div>ρ(H<sub>2</sub>O) = ${constants.ro_h2o.record}${g}/дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'text',
                  data: [
                    `ρ(H<sub>2</sub>O) = ${constants.ro_h2o.record}${t('gdm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.ro_v3', constants)}`,
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `ρ(H<sub>2</sub>O) = ${constants.ro_h2o.record}${t('gdm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'ro_r':
        if (vars.ro_r == undefined) {
          if (vars.m_r != undefined && vars.V_r != undefined) {
            vars.ro_r = roundValue(vars.m_r / vars.V_r, 'ro_r');
            step = {
              variable: 'ro_r',
              value: vars.ro_r,
              dependencies: ['m_r', 'V_r'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>ρ<sub>${rra}</sub> = <span class='fraction'><span class='top'>m<sub>${rra}</sub></span><span class='bottom'>V<sub>${rra}</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_r}${g}</span><span class='bottom'>${vars.V_r} дм<sup>3</sup></span></span> = ${vars.ro_r}${g}/дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Для нахождения массы через объем и плотность существует такая формула:</div><div class='formula'>m = ρ × V</div><div>Из этой формулы выразим плотность раствора (ρ<sub>${rra}</sub>) и вычислим ее:</div><div class='formula'>ρ<sub>${rra}</sub> = <span class='fraction'><span class='top'>m<sub>${rra}</sub></span><span class='bottom'>V<sub>${rra}</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_r}${g}</span><span class='bottom'>${vars.V_r} дм<sup>3</sup></span></span> = ${vars.ro_r}${g}/дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `ρ<sub>${t('sol')}</sub> = `,
                    [`m<sub>${t('sol')}</sub>`, `V<sub>${t('sol')}</sub>`],
                    ` = `,
                    [`${vars.m_r}${t('g')}`, `${vars.V_r} ${t('dm')}<sup>3</sup>`],
                    ` = ${vars.ro_r}${t('gdm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.ro_r1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.ro_r2')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ρ<sub>${t('sol')}</sub> = `,
                    [`m<sub>${t('sol')}</sub>`, `V<sub>${t('sol')}</sub>`],
                    ' = ',
                    [`${vars.m_r}${t('g')}`, `${vars.V_r} ${t('dm')}<sup>3</sup>`],
                    ` = ${vars.ro_r}${t('gdm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'ro_smesi':
        if (vars.ro_smesi == undefined) {
          if (vars.m_smesi != undefined && vars.V_smesi != undefined) {
            vars.ro_smesi = roundValue(vars.m_smesi / vars.V_smesi, 'ro_smesi');
            step = {
              variable: 'ro_smesi',
              value: vars.ro_smesi,
              dependencies: ['m_smesi', 'V_smesi'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>ρ<sub>${mix}</sub> = <span class='fraction'><span class='top'>m<sub>${mix}</sub></span><span class='bottom'>V<sub>${mix}</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_smesi}${g}</span><span class='bottom'>${vars.V_smesi} дм<sup>3</sup></span></span> = ${vars.ro_smesi}${g}/дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Для нахождения массы через объем и плотность существует такая формула:</div><div class='formula'>m = ρ × V</div><div>Из этой формулы выразим плотность ${mix} (ρ<sub>${mix}</sub>) и вычислим ее:</div><div class='formula'>ρ<sub>${mix}</sub> = <span class='fraction'><span class='top'>m<sub>${mix}</sub></span><span class='bottom'>V<sub>${mix}</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_smesi}${g}</span><span class='bottom'>${vars.V_smesi} дм<sup>3</sup></span></span> = ${vars.ro_smesi}${g}/дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: `formula`,
                  data: [`m = ρ × V`],
                },
                {
                  type: `formula`,
                  data: [
                    `ρ<sub>${t('mix')}</sub> = `,
                    [`m<sub>${t('mix')}</sub>`, `V<sub>${t('mix')}</sub>`],
                    ` = `,
                    [
                      `${vars.m_smesi}${t('g')}`,
                      `${vars.V_smesi} ${t('dm')}<sup>3</sup>`,
                    ]` = ${vars.ro_smesi}${t('gdm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: `text`,
                  data: [
                    `${t('taskSolver.ro_smesi1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: `text`,
                  data: [
                    `${t('taskSolver.ro_smesi2')}`,
                  ],
                },
                {
                  type: `formula`,
                  data: [
                    `ρ<sub>${t('mix')}</sub> = `,
                    [`m<sub>${t('mix')}</sub>`, `V<sub>${t('mix')}</sub>`],
                    ` = `,
                    [`${vars.m_smesi}${t('g')}`, `${vars.V_smesi} ${t('dm')}<sup>3</sup>`],
                    ` = ${vars.ro_smesi}${t('gdm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'ro_raspl':
        if (vars.ro_raspl == undefined) {
          if (vars.m_raspl != undefined && vars.V_raspl != undefined) {
            vars.ro_raspl = roundValue(vars.m_raspl / vars.V_raspl, 'ro_raspl');
            step = {
              variable: 'ro_raspl',
              value: vars.ro_raspl,
              dependencies: ['m_raspl', 'V_raspl'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>ρ<sub>${raspl}</sub> = <span class='fraction'><span class='top'>m<sub>${raspl}</sub></span><span class='bottom'>V<sub>${raspl}</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_raspl}${g}</span><span class='bottom'>${vars.V_raspl} дм<sup>3</sup></span></span> = ${vars.ro_raspl}${g}/дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Для нахождения массы через объем и плотность существует такая формула:</div><div class='formula'>m = ρ × V</div><div>Из этой формулы выразим плотность расплава (ρ<sub>${raspl}</sub>) и вычислим ее:</div><div class='formula'>ρ<sub>${raspl}</sub> = <span class='fraction'><span class='top'>m<sub>${raspl}</sub></span><span class='bottom'>V<sub>${raspl}</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_raspl}${g}</span><span class='bottom'>${vars.V_raspl} дм<sup>3</sup></span></span> = ${vars.ro_raspl}${g}/дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `ρ<sub>${t('melt')}</sub> = `,
                    [`m<sub>${t('melt')}</sub>`, `V<sub>${t('melt')}</sub>`],
                    ` = `,
                    [`${vars.m_raspl}${t('g')}`, `${vars.V_raspl} ${t('dm')}<sup>3</sup>`],
                    ` = ${vars.ro_raspl}${t('gdm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.ro_smesi1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: `text`,
                  data: [
                    `${t('taskSolver.ro_raspl1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ρ<sub>${t('melt')}</sub> = `,
                    [`m<sub>${t('melt')}</sub>`, `m<sub>${t('melt')}</sub>`],
                    ` = `,
                    [`${vars.m_raspl}${t('g')}`, `${vars.V_raspl} ${t('dm')}<sup>3</sup>`],
                    ` = ${vars.ro_raspl}${t('gdm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'ro_rud':
        if (vars.ro_rud == undefined) {
          if (vars.m_rud != undefined && vars.V_rud != undefined) {
            vars.ro_rud = roundValue(vars.m_rud / vars.V_rud, 'ro_rud');
            step = {
              variable: 'ro_rud',
              value: vars.ro_rud,
              dependencies: ['m_rud', 'V_rud'],
              record: {
                ru: `<div class='formula'>m = ρ × V</div><div class='formula'>ρ<sub>${rud}</sub> = <span class='fraction'><span class='top'>m<sub>${rud}</sub></span><span class='bottom'>V<sub>${rud}</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_rud}${g}</span><span class='bottom'>${vars.V_rud} дм<sup>3</sup></span></span> = ${vars.ro_rud}${g}/дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Для нахождения массы через объем и плотность существует такая формула:</div><div class='formula'>m = ρ × V</div><div>Из этой формулы выразим плотность ${rud} (ρ<sub>${rud}</sub>) и вычислим ее:</div><div class='formula'>ρ<sub>${rud}</sub> = <span class='fraction'><span class='top'>m<sub>${rud}</sub></span><span class='bottom'>V<sub>${rud}</sub></span></span> = <span class='fraction'><span class='top'>${vars.m_rud}${g}</span><span class='bottom'>${vars.V_rud} дм<sup>3</sup></span></span> = ${vars.ro_rud}${g}/дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'formula',
                  data: [
                    `ρ<sub>${t('ore')}</sub> = `,
                    [`m<sub>${t('ore')}</sub>`, `V<sub>${t('ore')}</sub>`],
                    ` = `,
                    [`${vars.m_rud}${t('g')}`, `${vars.V_rud} ${t('dm')}<sup>3</sup>`],
                    `> = ${vars.ro_rud}${t('gdm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.ro_smesi1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`m = ρ × V`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.ro_rud1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `ρ<sub>${t('ore')}</sub> = `,
                    [`m<sub>${t('ore')}</sub>`, `V<sub>${t('ore')}</sub>`],
                    ' = ',
                    [`${vars.m_rud}${t('g')}`, `${vars.V_rud} ${t('dm')}<sup>3</sup>`],
                    ` = ${vars.ro_rud}${t('gdm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'ma_v':
        if (vars.ma_v == undefined) {
          if (vars.m_v != undefined && vars.N_v != undefined) {
            vars.ma_v = roundValue(vars.m_v / vars.N_v, 'ma_v');
            step = {
              variable: 'ma_v',
              value: vars.ma_v,
              dependencies: ['m_v', 'N_v'],
              record: {
                ru: `<div class='formula'>N = <span class='fraction'><span class='top'>m</span><span class='bottom'>m<sub>${atom}</sub></span></span></div><div class='formula'>m<sub>${atom}</sub>${substB} = <span class='fraction'><span class='top'>m${substB}</span><span class='bottom'>N${substB}</span></span> = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.N_v}</span></span> = ${vars.ma_v}${g}</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая количество структурных единиц (N), массу (m) 
                  'и массу',
                 ${atom} (m<sub>${atom}</sub>), 
                  'записывается так',
                :</div><div class='formula'>N = <span class='fraction'><span class='top'>m</span><span class='bottom'>m<sub>${atom}</sub></span></span></div><div>Из этой формулы выразим массу ${atom} вещества ${subst}:</div><div class='formula'>m<sub>${atom}</sub>${substB} = <span class='fraction'><span class='top'>m${substB}</span><span class='bottom'>N${substB}</span></span> = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.N_v}</span></span> = ${vars.ma_v}${g}</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`N = `, [`m`, `m<sub>${atom}</sub>`]],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('atom')}</sub>${substB} = `,
                    [`m${substB}`, `N${substB}`],
                    ` = `,
                    [`${vars.m_v}${t('g')}`, `${vars.N_v}`],
                    ` = ${vars.ma_v}${t('g')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.ma_v1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`N = `, [`m`, `m<sub>${t('g')}</sub>`]],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.ma_v2', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `m<sub>${t('atom')}</sub>${substB} = `,
                    [`m${substB}`, `N${substB}`],
                    ` = `,
                    [`${vars.m_v}${t('g')}`, `${vars.N_v}`],
                    ` = ${vars.ma_v}${t('g')}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'N_v':
        if (vars.N_v == undefined) {
          if (vars.n_v != undefined) {
            vars.N_v = roundValue(vars.n_v * constants.N_a.value, 'N_v');
            step = {
              variable: 'N_v',
              value: vars.N_v,
              dependencies: ['n_v'],
              record: {
                ru: `<div class='formula'>n = <span class='fraction'><span class='top'>N</span><span class='bottom'>N<sub>A</sub></span></span></div><div class='formula'>N${substB} = n${substB} × N<sub>A</sub> = ${vars.n_v} ${mol} × ${constants.N_a.record} ${mol}<sup>-1</sup> = ${vars.N_v}</div>`,
              },
              explanation: {
                ru: `<div>Одна из формул для нохождения химического количества выглядит так:</div><div class='formula'>n = <span class='fraction'><span class='top'>N</span><span class='bottom'>N<sub>A</sub></span></span></div><div>Выражаем из нее число структурных единиц ${subst} (N) и подставляем число Авогадро (N<sub>A</sub>; это постоянная величина, которая равна 6,02 × 10<sup>23</sup> ${mol}<sup>-1</sup>) и химическое количество ${subst} (n):</div><div class='formula'>N${substB} = n${substB} × N<sub>A</sub> = ${vars.n_v} ${mol} × ${constants.N_a.record} ${mol}<sup>-1</sup> = ${vars.N_v}</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`n = `, [`N`, `N<sub>A</sub>`]],
                },
                {
                  type: 'formula',
                  data: [
                    `N${substB} = n${substB} × N<sub>A</sub> = ${vars.n_v} ${t('mole')} × ${constants.N_a.record} ${t('mole')}<sup>-1</sup> = ${vars.N_v}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.N_v1')}`],
                },
                {
                  type: 'formula',
                  data: [`n = `, [`N`, `N<sub>A</sub>`]],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.N_v2', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `N${substB} = n${substB} × N<sub>A</sub> = ${vars.n_v} ${t('mole')} × ${constants.N_a.record} ${t('mole')}<sup>-1</sup> = ${vars.N_v}`,
                  ],
                },
              ],
            };
          } else if (vars.m_v != undefined && vars.ma_v != undefined) {
            vars.N_v = roundValue(vars.m_v / vars.ma_v, 'N_v');
            step = {
              variable: 'N_v',
              value: vars.N_v,
              dependencies: ['m_v', 'ma_v'],
              record: {
                ru: `<div class='formula'>N = <span class='fraction'><span class='top'>m</span><span class='bottom'>m<sub>${atom}</sub></span></span></div><div class='formula'>N${substB} = <span class='fraction'><span class='top'>m${substB}</span><span class='bottom'>m<sub>${atom}</sub>${substB}</span></span> = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.ma_v}${g}</span></span> = ${vars.N_v}</div>`,
              },
              explanation: {
                ru: `<div>Формула, связывающая количество структурных единиц (N), массу (m) 
                  'и массу',
                 ${atom} (m<sub>${atom}</sub>), 
                  'записывается так',
                :</div><div class='formula'>N = <span class='fraction'><span class='top'>m</span><span class='bottom'>m<sub>${atom}</sub></span></span></div><div>Подставим в формулу массу ${atom} вещества и массу вещества, ведь они нам известны, и найдем количество структурных единиц:</div><div class='formula'>N${substB} = <span class='fraction'><span class='top'>m${substB}</span><span class='bottom'>m<sub>${atom}</sub>${substB}</span></span> = <span class='fraction'><span class='top'>${vars.m_v}${g}</span><span class='bottom'>${vars.ma_v}${g}</span></span> = ${vars.N_v}</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`N = `, [`m`, `m<sub>${t('atom')}</sub>`]],
                },
                {
                  type: 'formula',
                  data: [
                    `N${substB} = `,
                    [`m${substB}`, `m<sub>${t('atom')}</sub>${substB}`],
                    ` = `,
                    [`${vars.m_v}${t('g')}`, `${vars.ma_v}${t('g')}`],
                    ` = ${vars.N_v}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.ma_v1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`N = `, [`m`, `m<sub>${atom}</sub>`]],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.N_v3')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `N${substB} = `,
                    [`m${substB}`, `m<sub>${t('atom')}</sub>${substB}`],
                    ` = `,
                    [`${vars.m_v}${t('g')}`, `${vars.ma_v}${t('g')}`],
                    ` = ${vars.N_v}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'P':
        if (vars.P == undefined) {
          if (
            vars.n_v != undefined &&
            vars.V_v != undefined &&
            vars.T != undefined
          ) {
            vars.P = roundValue(
              (vars.n_v * vars.T * constants.R.value) / vars.V_v,
              'P',
            );
            step = {
              variable: 'P',
              value: vars.P,
              dependencies: ['n_v', 'T', 'V_v'],
              record: {
                ru: `<div class='formula'>P × V = n × R × T</div><div class='formula'>P${substB} = <span class='fraction'><span class='top'>n${substB} × R × T${substB}</span><span class='bottom'>V${substB}</span></span> = <span class='fraction'><span class='top'>${vars.n_v} ${mol} × ${constants.R.record} ${jmk} × ${vars.T} ${k}</span><span class='bottom'>${vars.V_v} дм<sup>3</sup></span></span> = ${vars.P} ${kpa}</div>`,
              },
              explanation: {
                ru: `<div>Запишем уравнение Менделеева-Клапейрона:</div><div class='formula'>P × V = n × R × T</div><div>Выразим из этого уравнения давление ${subst} (P) и подставим объем ${subst} (V), температуру газа (T), его химическое количество (n), а также газовую постоянную (R; это постоянная величина, которая равна ${constants.R.record} ${jmk}):</div><div class='formula'>P${substB} = <span class='fraction'><span class='top'>n${substB} × R × T${substB}</span><span class='bottom'>V${substB}</span></span> = <span class='fraction'><span class='top'>${vars.n_v} ${mol} × ${constants.R.record} ${jmk} × ${vars.T} ${k}</span><span class='bottom'>${vars.V_v} дм<sup>3</sup></span></span> = ${vars.P} ${kpa}</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`P × V = n × R × T`],
                },
                {
                  type: 'formula',
                  data: [
                    `P${substB} = `,
                    [`n${substB} × R × T${substB}`, `V${substB}`],
                    ` = `,
                    [
                      `${vars.n_v} ${t('mole')} × ${constants.R.record} ${t('j')}/${t('moleK')} × ${vars.T} ${t('k')}`,
                      `${vars.V_v} ${t('dm')}<sup>3</sup>`,
                    ],
                    ` = ${vars.P} ${t('kpa')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.n_v11')}`],
                },
                {
                  type: 'formula',
                  data: [`P × V = n × R × T`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.P1', {subst, constants})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `P${substB} = `,
                    [`n${substB} × R × T${substB}`, `V${substB}`],
                    ` = `,
                    [
                      `${vars.n_v} ${t('mole')} × ${constants.R.record} ${t('j')}/${t('moleK')} × ${vars.T} ${t('k')}`,
                      `${vars.V_v} ${t('dm')}<sup>3</sup>`,
                    ],
                    ` = ${vars.P} ${t('kpa')}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'T':
        if (vars.T == undefined) {
          if (
            vars.n_v != undefined &&
            vars.V_v != undefined &&
            vars.P != undefined
          ) {
            vars.T = roundValue(
              (vars.P * vars.V_v) / (vars.n_v * constants.R.value),
              'T',
            );
            step = {
              variable: 'T',
              value: vars.T,
              dependencies: ['n_v', 'P', 'V_v'],
              record: {
                ru: `<div class='formula'>P × V = n × R × T</div><div class='formula'>T${substB} = <span class='fraction'><span class='top'>P${substB} × V${substB}</span><span class='bottom'>R × n${substB}</span></span> = <span class='fraction'><span class='top'>${vars.P} ${kpa} × ${vars.V_v} дм<sup>3</sup></span><span class='bottom'>${constants.R.record} ${jmk} × ${vars.n_v} ${mol}</span></span> = ${vars.T} ${k}</div>`,
              },
              explanation: {
                ru: `<div>Запишем уравнение Менделеева-Клапейрона:</div><div class='formula'>P × V = n × R × T</div><div>Выразим из этого уравнения температуру ${subst} (T) и подставим объем ${subst} (V), давление газа (P), его химическое количество (n), а также газовую постоянную (R; это постоянная величина, которая равна ${constants.R.record} ${jmk}):</div><div class='formula'>T${substB} = <span class='fraction'><span class='top'>P${substB} × V${substB}</span><span class='bottom'>R × n${substB}</span></span> = <span class='fraction'><span class='top'>${vars.P} ${kpa} × ${vars.V_v} дм<sup>3</sup></span><span class='bottom'>${constants.R.record} ${jmk} × ${vars.n_v} ${mol}</span></span> = ${vars.T} ${k}</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`P × V = n × R × T`],
                },
                {
                  type: 'formula',
                  data: [
                    `T${substB} = `,
                    [`P${substB} × V${substB}`, `R × n${substB}`],
                    ` = `,
                    [
                      `${vars.P} ${t('kpa')} × ${vars.V_v} ${t('dm')}<sup>3</sup>`,
                      `${constants.R.record} ${t('j')}/${t('moleK')} × ${vars.n_v} ${t('mole')}`,
                    ],
                    ` = ${vars.T} ${t('k')}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.n_v11')}`],
                },
                {
                  type: 'formula',
                  data: [`P × V = n × R × T`],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.T1', {subst, constants})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `T${substB} = `,
                    [`P${substB} × V${substB}`, `R × n${substB}`],
                    ` = `,
                    [
                      `${vars.P} ${t('kpa')} × ${vars.V_v} дм<sup>3</sup>`,
                      `${constants.R.record} ${t('j')}/${t('moleK')} × ${vars.n_v} ${t('mole')}`,
                    ],
                    ` = ${vars.T} ${t('k')}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'C_v':
        if (vars.C_v == undefined) {
          if (vars.n_v != undefined && vars.V_r != undefined) {
            vars.C_v = roundValue(vars.n_v / vars.V_r, 'C_v');
            step = {
              variable: 'C_v',
              value: vars.C_v,
              dependencies: ['n_v', 'V_r'],
              record: {
                ru: `<div class='formula'>С = <span class='fraction'><span class='top'>n</span><span class='bottom'>V<sub>${rra}</sub></span></span></div><div class='formula'>С = <span class='fraction'><span class='top'>${vars.n_v} ${mol}</span><span class='bottom'>${vars.V_r} дм<sup>3</sup></span></span> = ${vars.C_v} ${mol}/дм<sup>3</sup></div>`,
              },
              explanation: {
                ru: `<div>Есть такая формула для нахождения молярной концентрации (С):</div><div class='formula'>С = <span class='fraction'><span class='top'>n</span><span class='bottom'>V<sub>${rra}</sub></span></span></div><div>Нам известно химическое количество (n) ${subst} и  объем раствора (V<sub>${rra}</sub>), поэтому можем вычислить молярную концентрацию ${subst} (C):</div><div class='formula'>С = <span class='fraction'><span class='top'>${vars.n_v} ${mol}</span><span class='bottom'>${vars.V_r} дм<sup>3</sup></span></span> = ${vars.C_v} ${mol}/дм<sup>3</sup></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`C = `, [`n`, `V<sub>${t('sol')}</sub>`]],
                },
                {
                  type: 'formula',
                  data: [
                    `C = `,
                    [`${vars.n_v} ${t('mole')}`, `${vars.V_r} ${t('dm')}<sup>3</sup>`],
                    ` = ${vars.C_v} ${t('mole')}/${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.V_r3')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`C = `, [`n`, `V<sub>${t('sol')}</sub>`]],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.C_v1', {subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `C = `,
                    [`${vars.n_v} ${t('mole')}`, `${vars.V_r} ${t('dm')}<sup>3</sup>`],
                    ` = ${vars.C_v} ${t('mole')}/${t('dm')}<sup>3</sup>`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'D_h':
        if (vars.D_h == undefined) {
          if (vars.M_v != undefined) {
            vars.D_h = roundValue(vars.M_v / constants.M_h.value, 'D_h');
            step = {
              variable: 'D_h',
              value: vars.D_h,
              dependencies: ['M_v'],
              record: {
                ru: `<div><span class="formula">D<sub>по H<sub>2</sub></sub> = <span class="fraction"><span class="top">M<sub>${sub}</sub></span><span class="bottom">M(H<sub>2</sub>)</span></span></span> = <span class="fraction"><span class="top">${vars.M_v}${g}/${mol}</span><span class="bottom">${constants.M_h.record}${g}/${mol}</span></span> = ${vars.D_h}</span></div>`,
              },
              explanation: {
                ru: `<div>Относительная плотность вещества по водороду - это отношение молярной массы этого вещества к молярной массе водорода. Формула для расчета относительной плотности по водороду:</div><div><span class="formula">D<sub>по H<sub>2</sub></sub> = <span class="fraction"><span class="top">M<sub>${sub}</sub></span><span class="bottom">M(H<sub>2</sub>)</span></span></span></div><div>Молярную массу вещества и молярную массу водорода мы знаем, так что выразим из этой формулы относительную плотность по водороду и найдем её:</div><div>D<sub>по H<sub>2</sub></sub> = <span class="fraction"><span class="top">${vars.M_v}${g}/${mol}</span><span class="bottom">${constants.M_h.record}${g}/${mol}</span></span> = ${vars.D_h}</span></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `D<sub>по H<sub>2</sub></sub> = `,
                    [`M<sub>${t('subs')}</sub>`, `M(H<sub>2</sub>)`],
                  ],
                },
                {
                  type: 'text',
                  data: [
                    ` = `,
                    [
                      `${vars.M_v}${t('gmole')}`,
                      `${constants.M_h.record}${t('gmole')}`,
                    ],
                    ` = ${vars.D_h}`,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.D_h1')}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `D<sub>по H<sub>2</sub></sub> = `,
                    [`M<sub>${t('subs')}</sub>`, `M(H<sub>2</sub>)`],
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.D_h2')}`,
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `D<sub>${t('to')} H<sub>2</sub></sub> = `,
                    [
                      `${vars.M_v}${t('gmole')}`,
                      `${constants.M_h.record}${t('gmole')}`,
                    ],
                    ` = ${vars.D_h}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;

      case 'D_vozd':
        if (vars.D_vozd == undefined) {
          if (vars.M_v != undefined) {
            vars.D_vozd = roundValue(
              vars.M_v / constants.M_vozd.value,
              'D_vozd',
            );
            step = {
              variable: 'D_vozd',
              value: vars.D_vozd,
              dependencies: ['M_v'],
              record: {
                ru: `<div><span class="formula">D<sub>${onAir}</sub> = <span class="fraction"><span class="top">M<sub>${sub}</sub></span><span class="bottom">M(${air})</span></span></span> = <span class="fraction"><span class="top">${vars.M_v}${g}/${mol}</span><span class="bottom">${constants.M_vozd.record}${g}/${mol}</span></span> = ${vars.D_vozd}</span></div>`,
              },
              explanation: {
                ru: `<div>Относительная плотность вещества по воздуху - это отношение молярной массы этого вещества к молярной массе воздуха. Формула для расчета относительной плотности по воздуху:</div><div><span class="formula">D<sub>${onAir}</sub> = <span class="fraction"><span class="top">M<sub>${sub}</sub></span><span class="bottom">M(${air})</span></span></span></div><div>Молярную массу вещества и молярную массу воздуха мы знаем, так что выразим из этой формулы относительную плотность по по воздуху и найдем её:</div><div>D<sub>${onAir}</sub> = <span class="fraction"><span class="top">${vars.M_v}${g}/${mol}</span><span class="bottom">${constants.M_vozd.record}${g}/${mol}</span></span> = ${vars.D_vozd}</span></div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `D<sub>${t('to')} ${t('air')}</sub> = `,
                    [
                      `M<sub>${t('subs')}</sub>`,
                      `M(${t('air')})`
                    ],
                    ` = `,
                    [
                      `${vars.M_v}${t('gmole')}`,
                      `${constants.M_vozd.record}${t('gmole')}`,
                    ],
                    ` = ${vars.D_vozd}`,
                    ,
                  ],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.D_vozd1')}`],
                },
                {
                  type: 'formula',
                  data: [
                    `D<sub>${t('to')} ${t('air')}</sub> = `,
                    [`M<sub>${t('subs')}</sub>`, `M(${t('air')})`],
                  ],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.D_vozd2')}`],
                },
                {
                  type: 'text',
                  data: [
                    `D<sub>${t('to')} ${t('air')}</sub> = `,
                    [
                      `${vars.M_v}${t('gmole')}`,
                      `${constants.M_vozd.record}${t('gmole')}`,
                    ],
                    ` = ${vars.D_vozd}`,
                  ],
                },
              ],
            };
          }

          if (step.variable != undefined) {
            steps.push(step);
          }
        }
        break;
    }
  }

  function findSolution(variable) {
    singleAnswer = [];
    steps = [];
    const LIMIT = 10;
    let i = 0;
    while (vars[variable] == undefined && i < LIMIT) {
      tryToFind('M_v');
      tryToFind('M_r');
      tryToFind('m_v');
      tryToFind('m_r');
      tryToFind('m_smesi');
      tryToFind('m_raspl');
      tryToFind('m_rud');
      tryToFind('n_v');
      tryToFind('V_v');
      tryToFind('V_n');
      tryToFind('V_r');
      tryToFind('V_smesi');
      tryToFind('V_raspl');
      tryToFind('V_rud');
      tryToFind('w_v');
      tryToFind('fi');
      tryToFind('ro_v');
      tryToFind('ro_r');
      tryToFind('ro_smesi');
      tryToFind('ro_raspl');
      tryToFind('ro_rud');
      tryToFind('ma_v');
      tryToFind('N_v');
      tryToFind('P');
      tryToFind('T');
      tryToFind('C_v');
      tryToFind('D_h');
      tryToFind('D_vozd');
      i++;
    }
    if (vars[variable] != undefined) {
      singleAnswer = steps;
    }
  }

  // решение задачи без реакции
  if (isSimple) {
    fillUndefinedVars();
    for (var i = 0; i < findFields.length; i++) {
      findSolution(findFields[i].var);
      if (singleAnswer[0] != undefined) {
        singleAnswer = clearAnswer(singleAnswer, findFields[i].var);
        answers.push(singleAnswer);
        addToShortAnswers(singleAnswer[singleAnswer.length - 1]);
      } else {
        var solutionError = {
          header: {
            ru: `Не удалось найти ${findFields[i].symbol}`,
          },
          description: {
            ru: `<div>Для поиска ${findFields[i].symbol} попробуйте воспользоваться разделом:</div><br><div style='margin-top: 10px' class='btn btn-default' ui-sref='formulas'><span>Формулы для решения задач</span></div>`,
          },
          headerData: [
            {
              type: 'text',
              data: [`${t('taskSolver.unableToFind', {findFields: findFields[i]})}`],
            },
          ],
          descriptionData: [
            {
              type: 'text',
              data: [
                `${t('taskSolver.tryUsingPart', {findFields: findFields[i]})}`,
              ],
            },
          ],
        };
        solutionErrors.push(solutionError);
      }
    }
  }

  // решение задачи с реакцией
  else {
    let reactionObject = reaction.object;
    // массив для хранения отдельных решений (для разных веществ в "найти" разные полные решения)
    solutions = [];
    // новые более удобные массивы для хранения "дано" и "найти", где все привязывается к веществам ("Na": m=3,n=4; ...)
    givenFieldsSol = [];
    findFieldsSol = [];

    // заполнение массива для "дано"
    for (var i = 0; i < givenFields.length; i++) {
      for (var j = 0; j < givenFieldsSol.length; j++) {
        if (givenFieldsSol[j].subst == givenFields[i].subst) {
          var newField = {
            var: givenFields[i].var,
            variable: givenFields[i].variable,
            value: givenFields[i].value,
            measure: givenFields[i].measure,
            symbol: givenFields[i].symbol,
          };
          givenFieldsSol[j].fields.push(newField);
          break;
        }
      }
      if (j == givenFieldsSol.length) {
        var newSubst = {
          subst: givenFields[i].subst,
          fields: [
            {
              var: givenFields[i].var,
              variable: givenFields[i].variable,
              value: givenFields[i].value,
              measure: givenFields[i].measure,
              symbol: givenFields[i].symbol,
            },
          ],
        };
        givenFieldsSol.push(newSubst);
      }
    }

    // заполнение массива для "найти"
    for (var i = 0; i < findFields.length; i++) {
      for (var j = 0; j < findFieldsSol.length; j++) {
        if (findFieldsSol[j].subst == findFields[i].subst) {
          var newField = {
            var: findFields[i].var,
            name: findFields[i].name,
            symbol: findFields[i].symbol,
          };
          findFieldsSol[j].fields.push(newField);
          break;
        }
      }
      if (j == findFieldsSol.length) {
        var newSubst = {
          subst: findFields[i].subst,
          fields: [
            {
              var: findFields[i].var,
              name: findFields[i].name,
              symbol: findFields[i].symbol,
            },
          ],
        };
        findFieldsSol.push(newSubst);
      }
    }

    // пробегаемся по всем веществам в "найти" и для каждого формируем отдельное полное решение
    for (var i = 0; i < findFieldsSol.length; i++) {
      const substAnswers = {
        subst: findFieldsSol[i].subst,
        answers: [],
      };
      answerSol = [];

      // проверяем, надо ли искать то, что уже дано по условию, если да, то записываем шаг решения, что уже дано и в ответ
      for (var j = 0; j < givenFieldsSol.length; j++) {
        if (givenFieldsSol[j].subst == findFieldsSol[i].subst) {
          for (var k = 0; k < givenFieldsSol[j].fields.length; k++) {
            for (var l = 0; l < findFieldsSol[i].fields.length; l++) {
              if (
                givenFieldsSol[j].fields[k].var ==
                findFieldsSol[i].fields[l].var
              ) {
                const findGivenStep = {
                  var: findFieldsSol[i].fields[l].var,
                  variable: findFieldsSol[i].fields[l].var,
                  value: givenFieldsSol[j].fields[k].value,
                  record: {
                    ru: `<div class="formula">${givenFieldsSol[j].fields[k].symbol}(${givenFieldsSol[j].subst}) = ${givenFieldsSol[j].fields[k].value} ${givenFieldsSol[j].fields[k].measure}</div>`,
                  },
                  explanation: {
                    ru: `<div>${givenFieldsSol[j].fields[k].symbol}(${givenFieldsSol[j].subst}) знаем из условия задачи:</div><div class="formula">${givenFieldsSol[j].fields[k].symbol}(${givenFieldsSol[j].subst}) = ${givenFieldsSol[j].fields[k].value} ${givenFieldsSol[j].fields[k].measure}</div>`,
                  },
                  recordData: [
                    {
                      type: 'formula',
                      data: [
                        `${givenFieldsSol[j].fields[k].symbol}(${givenFieldsSol[j].subst}) = ${givenFieldsSol[j].fields[k].value} ${givenFieldsSol[j].fields[k].measure}`,
                      ],
                    },
                  ],
                  explanationData: [
                    {
                      type: 'text',
                      data: [
                        `${givenFieldsSol[j].fields[k].symbol}(${givenFieldsSol[j].subst}) ${t('taskSolver.knowFromTask')}`,
                      ],
                    },
                    {
                      type: 'formula',
                      data: [
                        `${givenFieldsSol[j].fields[k].symbol}(${givenFieldsSol[j].subst}) = ${givenFieldsSol[j].fields[k].value} ${givenFieldsSol[j].fields[k].measure}`,
                      ],
                    },
                  ],
                };
                answerSol.push(findGivenStep);
                addToShortAnswers(findGivenStep);

                findFieldsSol[i].fields.splice(l, 1);
                l--;
              }
            }
          }
          break;
        }
      }

      // 2. Цикл для каждого вспомогательного вещества по поиску "n_v"
      // массив с нахождением n для каждого вспомогательного вещества

      const nHelpAnswers = [];
      for (var j = 0; j < givenFieldsSol.length; j++) {
        // проверка, вспомогательное ли это вещество для конкретного решения (у вспомогательного ничего искать не надо)
        if (givenFieldsSol[j].subst != findFieldsSol[i].subst) {
          const substSteps = {
            subst: givenFieldsSol[j].subst,
            steps: [],
          };
          var currentGiven = givenFieldsSol[j].fields;
          // проверка, известно ли уже по условию n_v
          let isNKnown = false;
          for (var k = 0; k < currentGiven.length; k++) {
            if (currentGiven[k].var == 'n_v') {
              isNKnown = true;
              break;
            }
          }

          if (isNKnown) {
            singleAnswer = [
              {
                variable: 'n_v',
                value: currentGiven[k].value,
                dependencies: [],
                record: {
                  ru: `<div class="formula">n(${substSteps.subst}) = ${currentGiven[k].value} моль</div>`,
                },
                explanation: {
                  ru: `<div class="formula">n(${substSteps.subst}) = ${currentGiven[k].value} моль</div><div>Химическое количество ${substSteps.subst} известно по условию задачи и равняется ${currentGiven[k].value} моль.</div>`,
                },
                recordData: [
                  {
                    type: 'formula',
                    data: [
                      `n(${substSteps.subst}) = ${currentGiven[k].value} ${t('mole')}`,
                    ],
                  },
                ],
                explanationData: [
                  {
                    type: 'formula',
                    data: [
                      `n(${substSteps.subst}) = ${currentGiven[k].value} ${t('mole')}`,
                    ],
                  },
                  {
                    type: 'text',
                    data: [
                      `${t('taskSolver.chemicalAmountEquals', {substSteps, currentGiven: currentGiven[k]})}`,
                    ],
                  },
                ],
              },
            ];
          } else if (!isNKnown) {
            resetVars();
            subst = givenFieldsSol[j].subst;
            substB = `(${subst})`;
            for (var k = 0; k < currentGiven.length; k++) {
              vars[currentGiven[k].var] = currentGiven[k].value;
            }
            findSolution('n_v');
            singleAnswer = clearAnswer(singleAnswer, 'n_v');
          }

          if (singleAnswer.length > 0) {
            substSteps.steps = singleAnswer;
            nHelpAnswers.push(substSteps);
          }
        }
      }

      // n для всех вспомогательных уже найдено, проверяем, сколько их
      if (nHelpAnswers.length > 0) {
        // объект с верхними и нижними надписями в реакции (1 моль, x моль)
        reactRemarks = {
          top: [],
          bottom: [],
        };
        // запись значение в правильном порядке в этот объект
        for (var k = 0; k < reaction.object.length; k++) {
          reactRemarks.top[k] = '';
          reactRemarks.bottom[k] = '';

          // в-во, над которым ставить x
          if (reaction.object[k].subst == findFieldsSol[i].subst) {
            reactRemarks.top[k] = 'x';
            reactRemarks.bottom[k] = `${reaction.object[k].coef}`;
          } else {
            for (var l = 0; l < nHelpAnswers.length; l++) {
              if (reaction.object[k].subst == nHelpAnswers[l].subst) {
                reactRemarks.top[k] = `${
                  nHelpAnswers[l].steps[nHelpAnswers[l].steps.length - 1].value
                }`;
                reactRemarks.bottom[k] = `${reaction.object[k].coef}`;
                break;
              }
            }
          }
        }
        // $log.info(reactRemarks);

        if (nHelpAnswers.length > 1) {
          var comparisonStep = {};
          // сортировка по возрастанию величины n_v
          for (var k = 0; k < nHelpAnswers.length - 1; k++) {
            let swapped = false;
            for (var l = 0; l < nHelpAnswers.length - 1 - k; l++) {
              if (
                nHelpAnswers[l].steps[nHelpAnswers[l].steps.length - 1].value >
                nHelpAnswers[l + 1].steps[nHelpAnswers[l + 1].steps.length - 1]
                  .value
              ) {
                const saved = nHelpAnswers[l];
                nHelpAnswers[l] = nHelpAnswers[l + 1];
                nHelpAnswers[l + 1] = saved;
                swapped = true;
              }
            }
            if (!swapped) {
              break;
            }
          }

          // случай, когда 2 вспомогательных в-ва, и их хим. кол-ва равны
          if (
            nHelpAnswers.length == 2 &&
            nHelpAnswers[0].steps[nHelpAnswers[0].steps.length - 1].value ==
              nHelpAnswers[1].steps[nHelpAnswers[1].steps.length - 1].value
          ) {
            comparisonStep = {
              record: {
                ru: `<div class="formula">n(${nHelpAnswers[0].subst}) = n(${nHelpAnswers[1].subst})</div><div>Расчет будем вести по ${nHelpAnswers[0].subst}</div>`,
              },
              explanation: {
                ru: `<div>Сравним химические поличества ${nHelpAnswers[0].subst} и ${nHelpAnswers[1].subst}:</div><div class="formula">n(${nHelpAnswers[0].subst}) = n(${nHelpAnswers[1].subst})</div><div>Они равны, поэтому расчет можно вести по любому из этих веществ. Давайте для дальнейших вычислений возьмем вещество ${nHelpAnswers[0].subst}</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [
                    `n(${nHelpAnswers[0].subst}) = n(${nHelpAnswers[1].subst})`,
                  ],
                },
                {
                  type: 'text',
                  data: [`${t('taskSolver.calcMadeTo', {nHelpAnswers: nHelpAnswers[0]})}`],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.compareAmounts', {subst1: nHelpAnswers[0].subst, subst2: nHelpAnswers[1].subst})}`,
                  ],
                },
                {
                  type: 'formula',
                  data: [
                    `n(${nHelpAnswers[0].subst}) = n(${nHelpAnswers[1].subst})`,
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.equalSo',{subst: nHelpAnswers[0].subst})}`,
                  ],
                },
              ],
            };
          } else {
            let comparisonString = '';
            for (var k = 0; k < nHelpAnswers.length; k++) {
              comparisonString += `n(${nHelpAnswers[k].subst})`;
              if (k < nHelpAnswers.length - 1) {
                comparisonString += ' < ';
              }
            }
            let substsExcessString = '';
            for (var k = 1; k < nHelpAnswers.length; k++) {
              substsExcessString += nHelpAnswers[k].subst;
              if (k < nHelpAnswers.length - 1) {
                substsExcessString += ', ';
              }
            }

            // шаг, в котором сравниваются n разных веществ, чтобы определить избытки и недостатки
            comparisonStep = {
              record: {
                ru: `<div class="formula">${comparisonString}</div><div>${nHelpAnswers[0].subst} в недостатке</div>`,
              },
              explanation: {
                ru: `<div>Сравним химические поличества ${nHelpAnswers[0].subst}, ${substsExcessString}:</div><div class="formula">${comparisonString}</div><div>${substsExcessString} - в избытке; ${nHelpAnswers[0].subst} - в недостатке</div><div>Задачи на избыток и недостаток всегда решаются <strong>по недостатку</strong>, поэтому решаем задачу по ${nHelpAnswers[0].subst}.</div>`,
              },
              recordData: [
                {
                  type: 'formula',
                  data: [`${comparisonString}`],
                },
                {
                  type: 'text',
                  data: [`${nHelpAnswers[0].subst} ${t('taskSolver.inLack')}`],
                },
              ],
              explanationData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.compareChemicalAmounts')}${nHelpAnswers[0].subst}, ${substsExcessString}:`,
                  ],
                },
                {
                  type: 'formula',
                  data: [`${comparisonString}`],
                },
                {
                  type: 'text',
                  data: [
                    `${substsExcessString} ${t('taskSolver.isInExcess')}; ${nHelpAnswers[0].subst} ${t('taskSolver.isInLack')}`,
                  ],
                },
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.lackExcessTasks')}${nHelpAnswers[0].subst}.`,
                  ],
                },
              ],
            };
          }
        }
        // вставляем в шаги решения
        for (var k = 0; k < nHelpAnswers.length; k++) {
          for (var l = 0; l < nHelpAnswers[k].steps.length; l++) {
            answerSol.push(nHelpAnswers[k].steps[l]);
          }
        }
        if (nHelpAnswers.length > 1) {
          answerSol.push(comparisonStep);
        }

        // 3. составляем пропорцию по веществу с меньшим химическим кол-вом (всегда на 0 месте после сортировки), пример: 4:2 = x:3

        // ищем, на каком месте в реакции вещество с наимеьшим химическим количеством, чтобы выбрать коэффициент
        // делаем объект для пропорции и заполняем его
        const proportion = {
          helpSubst: {},
          findSubst: {},
        };

        let isHelpSubstFinded = false;
        const isFindSubstFinded = false;
        for (var k = 0; k < reaction.object.length; k++) {
          if (
            !isHelpSubstFinded &&
            nHelpAnswers[0].subst == reaction.object[k].subst
          ) {
            proportion.helpSubst = {
              subst: nHelpAnswers[0].subst,
              value:
                nHelpAnswers[0].steps[nHelpAnswers[0].steps.length - 1].value,
              coef: reaction.object[k].coef,
            };
            isHelpSubstFinded = true;
          } else if (
            !isFindSubstFinded &&
            findFieldsSol[i].subst == reaction.object[k].subst
          ) {
            proportion.findSubst = {
              subst: findFieldsSol[i].subst,
              coef: reaction.object[k].coef,
            };
          }

          if (isHelpSubstFinded && isFindSubstFinded) {
            break;
          }
        }

        if (proportion.helpSubst.value != undefined) {
          proportion.findSubst.value = roundValue(
            (proportion.helpSubst.value * proportion.findSubst.coef) /
              proportion.helpSubst.coef,
            'n_v',
          );

          // шаг с пропорцией для записи в решение
          const proportionStep = {
            record: {
              ru: `<div class="formula"><span class="fraction"><span class="top">${proportion.helpSubst.value}</span><span class="bottom">${proportion.helpSubst.coef}</span></span> = <span class="fraction"><span class="top">x</span><span class="bottom">${proportion.findSubst.coef}</span></span></div><div class="formula">x = <span class="fraction"><span class="top">${proportion.helpSubst.value} × ${proportion.findSubst.coef}</span><span class="bottom">${proportion.helpSubst.coef}</span></span> = ${proportion.findSubst.value}</div><div class="formula">n(${proportion.findSubst.subst}) = ${proportion.findSubst.value} моль</div>`,
            },
            explanation: {
              ru: `<div>Составим пропорцию по уравнению реакции для нахождения химического количества ${proportion.findSubst.subst}:</div><div class="formula"><span class="fraction"><span class="top">${proportion.helpSubst.value}</span><span class="bottom">${proportion.helpSubst.coef}</span></span> = <span class="fraction"><span class="top">x</span><span class="bottom">${proportion.findSubst.coef}</span></span></div><div>Найдем из пропорции x (то есть химическое количество ${proportion.findSubst.subst}):</div><div class="formula">x = <span class="fraction"><span class="top">${proportion.helpSubst.value} × ${proportion.findSubst.coef}</span><span class="bottom">${proportion.helpSubst.coef}</span></span> = ${proportion.findSubst.value}</div><div class="formula">n(${proportion.findSubst.subst}) = ${proportion.findSubst.value} моль</div>`,
            },
            recordData: [
              {
                type: 'formula',
                data: [
                  [
                    `${proportion.helpSubst.value}`,
                    `${proportion.helpSubst.coef}`,
                  ],
                  ` = `,
                  [`x`, `${proportion.findSubst.coef}`],
                ],
              },
              {
                type: 'formula',
                data: [
                  `x = `,
                  [
                    `${proportion.helpSubst.value} × ${proportion.findSubst.coef}`,
                    `${proportion.helpSubst.coef}`,
                  ],
                  ` = `,
                  `${proportion.findSubst.value}`,
                ],
              },
              {
                type: 'formula',
                data: [
                  `n(${proportion.findSubst.subst}) = ${proportion.findSubst.value} ${t('mole')}`,
                ],
              },
            ],
            explanationData: [
              {
                type: 'text',
                data: [
                  `${t('taskSolver.proportionStep')}${proportion.findSubst.subst}:`,
                ],
              },
              {
                type: 'formula',
                data: [
                  [
                    `${proportion.helpSubst.value}`,
                    `${proportion.helpSubst.coef}`,
                  ],
                  ` = `,
                  [`x`, `${proportion.findSubst.coef}`],
                ],
              },
              {
                type: 'text',
                data: [
                  `${t('taskSolver.proportionStep1')}${proportion.findSubst.subst}):`,
                ],
              },
              {
                type: 'formula',
                data: [
                  `x = `,
                  [
                    `${proportion.helpSubst.value} × ${proportion.findSubst.coef}`,
                    `${proportion.helpSubst.coef}`,
                  ],
                  ` = `,
                  `${proportion.findSubst.value}`,
                ],
              },
              {
                type: 'formula',
                data: [
                  `n(${proportion.findSubst.subst}) = ${proportion.findSubst.value} ${t('mole')}`,
                ],
              },
            ],
          };
          answerSol.push(proportionStep);

          // поле с найденным по пропорции химическим кол-вом для вещества, у которого что-то еще надо найти
          quantityGivenField = {
            variable: 'n_v',
            var: 'n_v',
            value: proportion.findSubst.value,
            symbol: `n<sub>в-ва</sub>`,
            subst: proportion.findSubst.subst,
          };
        }
        // химическое количество у в-ва по пропорции найдено, теперь ищем то, что надо найти по условию
      }

      // пробегаемся циклом по всем величинам, которые надо найти у в-ва, находим, вставляем в решение
      for (var j = 0; j < findFieldsSol[i].fields.length; j++) {
        if (
          findFieldsSol[i].fields[j].var == 'n_v' &&
          quantityGivenField != undefined
        ) {
          // просто добавляем ответ
          addToShortAnswers(quantityGivenField);
        } else {
          var currentGiven = [];
          for (var k = 0; k < givenFieldsSol.length; k++) {
            if (findFieldsSol[i].subst == givenFieldsSol[k].subst) {
              currentGiven = givenFieldsSol[k].fields;
              break;
            }
          }

          // если нашли химическое кол-во по пропорции
          if (quantityGivenField != undefined) {
            // проверка, введено ли химическое кол-во вручную, если да, то заменяем его значение
            let isQuantityGivenFieldExists = false;
            for (var k = 0; k < currentGiven.length; k++) {
              if (currentGiven[k].var == 'n_v') {
                currentGiven[k].value = quantityGivenField.value;
                isQuantityGivenFieldExists = true;
                break;
              }
            }
            if (!isQuantityGivenFieldExists) {
              currentGiven.push(quantityGivenField);
            }
          }

          if (currentGiven.length > 0) {
            // заполняем vars значениями конкретной величины конкретного вещества
            resetVars();
            subst = findFieldsSol[i].subst;
            substB = `(${subst})`;
            for (var k = 0; k < currentGiven.length; k++) {
              vars[currentGiven[k].var] = currentGiven[k].value;
            }
            findSolution(findFieldsSol[i].fields[j].var);
            singleAnswer = clearAnswer(
              singleAnswer,
              findFieldsSol[i].fields[j].var,
            );
            if (singleAnswer.length > 0) {
              // добавляем ответ
              singleAnswer[singleAnswer.length - 1].subst =
                findFieldsSol[i].subst;
              addToShortAnswers(singleAnswer[singleAnswer.length - 1]);
            } else {
              var solutionError = {
                header: {
                  ru: `Не удалось найти ${findFieldsSol[i].fields[j].symbol}(${findFieldsSol[i].subst})`,
                },
                description: {
                  ru: `<div>Для поиска ${findFieldsSol[i].fields[j].symbol}(${findFieldsSol[i].subst}) попробуйте воспользоваться разделом:</div><br><div style='margin-top: 10px' class='btn btn-default' ui-sref='formulas'><span>Формулы для решения задач</span></div>`,
                },
                headerData: [
                  {
                    type: 'text',
                    data: [
                      `${t('taskSolver.unableToFind2')}${findFieldsSol[i].fields[j].symbol}(${findFieldsSol[i].subst})`,
                    ],
                  },
                ],
                descriptionData: [
                  {
                    type: 'text',
                    data: [
                      `${t('taskSolver.forSearch', { symbol: findFieldsSol[i].fields[j].symbol, subst: findFieldsSol[i].subst } /*MY TO DO  {findFieldsSol[i].fields[j].symbol}(${findFieldsSol[i].subst})}*/)}`,
                    ],
                  },
                ],
              };
              solutionErrors.push(solutionError);
            }
            // $log.info('singleAnswerSol sol', singleAnswerSol);
            if (singleAnswer.length > 0) {
              for (var k = 0; k < singleAnswer.length; k++) {
                answerSol.push(singleAnswer[k]);
              }

              // удалить из списка для дальнейшего поиска
              // findFieldsSol[i].fields.splice(j, 1);
              // j--;
              // $log.info('findFieldsDel', findFieldsSol[i].fields);
            }
            answerSol = deleteRepeatingsInSteps(answerSol);
          }

          // если не получилось даже дойти до пропорции
          if (answerSol.length == 0) {
            var solutionError = {
              header: {
                ru: `Не удалось ничего найти`,
              },
              description: {
                ru: `Перепроверь, правильно ли все заполнено, или попробуй воспользоваться разделом:</div><br><div style='margin-top: 10px' class='btn btn-default' ui-sref='formulas'><span>Формулы для решения задач</span></div>`,
              },
              headerData: [
                {
                  type: 'text',
                  data: [`${t('taskSolver.noResults')}`],
                },
              ],
              descriptionData: [
                {
                  type: 'text',
                  data: [
                    `${t('taskSolver.doubleCheck')}`,
                  ],
                },
              ],
            };
            solutionErrors.push(solutionError);
          }
        }
      }
    }
  }

  // заполнение массива для коротких ответов в самом конце решения. Например: m(Cu) = 20 г
  function addToShortAnswers(lastStep) {
    for (let i = 0; i < variablesList.length; i++) {
      if (variablesList[i].var == lastStep.variable) {
        const singleShortAnswer = {
          symbol: variablesList[i].symbol,
          value: lastStep.value,
          measures: variablesList[i].measures,
        };
        if (!isSimple) {
          singleShortAnswer.subst = lastStep.subst;
        }
        shortAnswers.push(singleShortAnswer);
        break;
      }
    }
  }

  // Удаление повторяющихся шагов в разных answer. Т.е., чтобы при поиске новой величины, старые поля не дублировались
  function deleteRepeatingsInAnswers() {
    if (answers.length > 1) {
      for (let i = 1; i < answers.length; i++) {
        for (let j = 0; j < i; j++) {
          for (let k = 0; k < answers[i].length; k++) {
            for (let l = 0; l < answers[j].length; l++) {
              if (answers[i][k] == answers[j][l]) {
                answers[j].splice(l, 1);
                l--;
              }
            }
          }
        }
      }
    }
  }
  deleteRepeatingsInAnswers();

  function deleteRepeatingsInSteps(steps) {
    const cleanedSteps = [];
    for (let i = 0; i < steps.length; i++) {
      let exists = false;
      for (let j = 0; j < cleanedSteps.length; j++) {
        if (steps[i].record.ru == cleanedSteps[j].record.ru) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        cleanedSteps.push(steps[i]);
      }
    }
    return cleanedSteps;
  }

  if (
    (answers != undefined && answers.length > 0 && isSimple) ||
    (answerSol != undefined && answerSol.length > 0 && !isSimple)
  ) {
    solutionWaitingShow = false;
    readySolutionShow = true;
  }
  if (solutionErrors.length > 0) {
    solutionWaitingShow = false;
    solutionErrorsShow = true;
  }

  // SOLUTION: решение до ответа для каждого, потом отбрасывание лишнего у каждого, потом объединение уникальных
  function clearAnswer(answer, variable) {
    // удаление степов с undefined
    const answerCopy = [];
    for (var i = 0; i < answer.length; i++) {
      if (answer[i].variable != undefined) {
        answerCopy.push(answer[i]);
      }
    }

    // удаление лишних вычисленных данных, остается только то, что до искомой величины
    for (var i = answerCopy.length - 1; i >= 0; i--) {
      if (answerCopy[i].variable != variable) {
        answerCopy.pop();
      } else {
        break;
      }
    }
    // здесь поставил var
    var answer = answerCopy;
    findDependence();

    // рекурсией добавляются все связанные шаги
    function findDependence() {
      if (answer[answer.length - 1] != undefined) {
        const dependenciesArray = answer[answer.length - 1].dependencies;
        const nearest = answer[answer.length - 1];
        answerCopy.unshift(nearest);

        var depSteps = [];
        depSteps.push(answer[answer.length - 1]);
        addDependentSteps(answer[answer.length - 1]);
        answer = depSteps;
      }

      function addDependentSteps(step) {
        for (let i = 0; i < step.dependencies.length; i++) {
          if (findNumberInList(step.dependencies[i]) != false) {
            const currentStep = answer[findNumberInList(step.dependencies[i])];
            depSteps.unshift(currentStep);
            addDependentSteps(currentStep);
          }
        }
      }

      function findNumberInList(variable) {
        let isExists = false;
        for (var i = 0; i < answer.length; i++) {
          if (answer[i].variable == variable) {
            isExists = true;
            break;
          }
        }
        if (isExists) {
          return i;
        }
        return isExists;
      }
    }
    return answer;
  }

  return {
    answers,
    answerSol,
    reactRemarks,
    shortAnswers,
    convertedMeasures,
    solutionErrors,
    reaction,
    isSimple
  };
};
