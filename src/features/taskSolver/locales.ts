import { LOCALES } from '../../localization/constants';

export default {
  [LOCALES.ru]: {
    title: 'Решение задач',
    examples: 'Примеры',
    yes: 'Да',
    no: 'Нет',
    next: 'Далее',
    solve: 'Решить',
    search: 'Поиск...',
    answer: 'Ответ:',
    given: 'Дано:',
    find: 'Найти:',
    detailed: 'Подробно',
    close: 'Закрыть',
    entering: 'Вводим:',
    enter: 'Ввод',
    enterReactionManually: 'Ввести реакцию вручную',
    reactionQuestion: 'В условии задачи говорится о проходящей реакции?',
    formulasForSolution: 'Формулы для решения задач',
    reactionDescription:
      '"Да", если одно вещество получается из другого, что-то к чему-то добавляют, вещество горит, окисляется и т.д.',
    substanceQuestion: 'Известно ли вещество',
    substanceDescription:
      '"Да", если в задаче говорится: "найдите массу натрия", "объём NaOH равен 40 литров", "железная руда", а не: "объём вещества", "масса вещества"...',
    substanceQuestionFirstCondition:
      '"Масса калия известна и равняется 145 г, найдите его химическое количество n."',
    substanceQuestionSecondCondition:
      '"Найдите химическое количество магния, содержащегося в магниевой руде массой 500 г с массовой долей магния 40%?"',
    substanceQuestionThirdCondition:
      '"Масса вещества равняется 20 г, а его молярная масса - 100 г/моль. Найдите химическое количество вещества"',
    problemGivenHelpText: 'Запиши, что дано по условию задачи:',
    problemFindHelpText: 'Запиши, что надо найти:',
    reactionFindHintText: 'Вы можете написать всю реакцию самостоятельно:',
    reactionFindUseSearch:
      'Воспользуйтесь поиском, чтобы найти нужную вам реакцию.',
    reactionFindExample:
      'Например, если в условии задачи сказано: "Водород реагирует с кислородом", то надо ввести:',
    reactionFindAnotherExample: 'Другие примеры',
    reactionFindExamples: 'Примеры поиска реакций',
    reactionFindFirstCondition: '"Калий взаимодействует с водой..."',
    reactionFindSecondCondition:
      '"Какие количества оксида бария и серной кислоты потребуются для получения 100 сульфата бария?"',
    reactionFindThirdCondition:
      '"В реакцию с соляной кислотой вступило 13 г цинка..."',
    reactionFindFourthCondition:
      '"В результате реакции соляной кислоты химическим количеством 2 моль с некоторой солью образовалось 300 г CaCl2..."',
    select: 'Выбрать',
    enterFullReaction: 'Введите полную реакцию, можно без коэффициентов.',
    forExample: 'Например: ',
    enterSubstanceFormula: 'Введите формулу вещества',
    correctEntry: 'Правильная запись: ',
    incorrectEntry: 'Неправильная запись: ',
    incorrectExampleSodiumChloride: 'хлорид натрия',
    substanceExample: 'Например:  Cu(OH)2',
    isReactionRunning: 'Происходит ли реакция?',
    isReactionRunningFirstCondition:
      '"В реакцию с соляной кислотой вступило 13 г цинка. Определите массы израсходованной кислоты и полученной соли, а также объем выделившегося газа."',
    isReactionRunningSecondCondition:
      '"Массовая доля железа в руде равна 75%, найдите массу руды, если химическое количество железа равняется 2 моль."',
    isReactionRunningAnswer: 'Происходит ли реакция: ',
    generateExplanation1:
      'Откроем таблицу Менделеева и посчитаем молярную массу вещества {{substB}}, суммируя молярные массы простых веществ, которые входят в его состав.',
    generateExplanation2:
      'Очень подробно это объясняется в разделе "Найти молярную массу"',
    generateExplanation3:
      'Откроем таблицу Менделеева и найдем в ней молярную массу вещества {{substB}}',
    generateExplanation4:
      'Запишем формулу нахождения химического количества (n) через массу (m) и молярную массу (M) вещества:',
    generateExplanation5:
      'Выразим из этой формулы молярную массу (M). Химическое количество (n) и масса (m) нам известны, поэтому мы можем найти молярную массу (M):',
    generateExplanation6:
      'Относительная плотность вещества по водороду - это отношение молярной массы этого вещества к молярной массе водорода. Формула для расчета относительной плотности по водороду:',
    generateExplanation7:
      'Относительную плотность по водороду и молярную массу водорода мы знаем, так что выразим из этой формулы молярную массу (M) вещества и найдем её:',
    generateExplanation8:
      'Относительная плотность вещества по воздуху - это отношение молярной массы этого вещества к молярной массе воздуха. Формула для расчета относительной плотности по воздуху:',
    generateExplanation9:
      'Относительную плотность по воздуху и молярную массу воздуха мы знаем, так что выразим из этой формулы молярную массу (M) вещества и найдем её:',
    generateExplanation10:
      'Относительная молекулярная масса численно равна молярной массе, а ее мы знаем.',
    m_v1: 'Из этой формулы выразим массу вещества и найдем ее значение:',
    formulaConnectingMPV:
      'Формула, связывающая массу (m), плотность (ρ) и объём (V), записывается так:',
    m_v3: 'По этой формуле найдем массу вещества {{subst}}:',
    m_v4:
      'Формула, связывающая количество структурных единиц (N), массу (m) и массу атома (m<sub>атома</sub>), записывается так:',
    m_vExpressMassFromFormula:
      'Из этой формулы выразим массу вещества {{subst}}:',
    m_v6:
      'Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу раствора (m<sub>р-ра</sub>), записывается так:',
    m_v7:
      'Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу смеси веществ (m<sub>смеси</sub>), записывается так:',
    m_v8:
      'Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу расплава (m<sub>распл.</sub>), записывается так:',
    m_v9:
      'Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу руды (m<sub>руды</sub>), записывается так:',
    m_r2: 'По этой формуле найдем массу раствора {{subst}}:',
    m_r3:
      'Так выглядит формула, связывающая массовую долю вещества (ω<sub>в-ва</sub>), массу вещества (m<sub>в-ва</sub>) и массу раствора (m<sub>р-ра</sub>):',
    m_r4: 'Из этой формулы выразим массу раствора {{subst}}:',
    m_smesi2: 'По этой формуле найдем массу смеси {{subst}}:',
    m_smesi3:
      'Так выглядит формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу смеси (m<sub>смеси</sub>):',
    m_smesi4: 'Из этой формулы выразим массу смеси {{subst}}:',
    m_raspl1: 'По этой формуле найдем массу расплава {{subst}}:',
    m_raspl2:
      'Так выглядит формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу расплава (m<sub>распл.</sub>):',
    m_raspl3: 'Из этой формулы выразим массу расплава {{subst}}:',
    m_rud1: 'По этой формуле найдем массу руды {{subst}}:',
    m_rud2:
      'Так выглядит формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу руды (m<sub>руды</sub>):',
    m_rud3: 'Из этой формулы выразим массу руды {{subst}}:',
    n_v1: 'Существует такая формула для нахождения молярной концентрации (С):',
    n_v2:
      'Выразим из этой фомулы химическое количество (n) {{subst}} и подставим в нее молярную концентрацию {{subst}} (C) и объём раствора {{subst}} (V<sub>р-ра</sub>):',
    n_v3: 'Химическое количество находится по формуле:',
    n_v4:
      'Подставим в эту формулу массу {{subst}} и молярную массу {{subst}} и вычислим химическое количество:',
    n_v5: 'Таким образом записывается формула для нахождения молярного объема:',
    n_v6:
      'Выразим из этого уравнения химическое количество (n) {{subst}} и подставим молярный объем {{subst}} (V<sub>n</sub>) и объем {{subst}} (V):',
    n_v7: 'Объем газа находится по формуле:',
    n_v8:
      'Из этой формулы выразим химическое количество {{subst}} (n) и подставим в нее объем {{subst}} (V) и молярный объем газа при нормальных условиях (V<sub>n</sub>; это постоянная величина, которая равна 22,4 дм<sup>3</sup>):',
    n_v9: 'Химическое количество находится по формуле:',
    n_v10:
      'Подставим в эту формулу число структурных единиц {{subst}} (N) и число Авогадро (N<sub>A</sub>; это постоянная величина, которая равна 6,02 × 10<sup>23</sup> моль<sup>-1</sup>) и вычислим химическое количество {{subst}}:',
    n_v11: 'Запишем уравнение Менделеева-Клапейрона:',
    n_v12:
      'Выразим из этого уравнения химическое количество (n) {{subst}} и подставим объем {{subst}} (V), давление газа (P), его температуру (T), а также газовую постоянную (R; это постоянная величина, которая равна {{constants.R.record}} Дж/(моль×K)):',
    V_v1:
      'Для нахождения массы через объем и плотность существует такая формула:',
    V_v2: 'Из этой формулы выразим объем {{subst}} (V) и вычислим его:',
    V_v3:
      'Выразим из этого уравнения объем (V) {{subst}} и подставим химическое количество {{subst}} (n), давление газа (P), его температуру (T), а также газовую постоянную (R; это постоянная величина, которая равна {{constants.R.record}} Дж/(моль×K)):',
    V_v4: 'Объем газа находится по формуле:',
    V_v5:
      'Подставим в нее химическое количество {{subst}} (n) и молярный объем газа при нормальных условиях (V<sub>n</sub>; это постоянная величина, которая равна 22,4 дм<sup>3</sup>):',
    V_v6:
      'Объемная доля газа (φ) показывает, какую часть общего объема смеси занимает данный газ, и находится по формуле:',
    V_v7:
      'Отсюда выразим объем вещества (V<sub>в-ва</sub>) {{subst}} и подставим объем смеси (V<sub>смеси</sub>) и объемную долю вещества в ней (φ):',
    V_v8: 'Таким образом записывается формула для нахождения молярного объема:',
    V_v9:
      'Выразим из этой формулы объем вещества (V) {{subst}} и подставим молярный объем {{subst}} (V<sub>n</sub>) и химическое количество {{subst}} (n):',
    V_n1: 'Таким образом записывается формула для нахождения молярного объема:',
    V_n2:
      'Подставим в записанную формулу химическое количество (n) {{subst}} и объем (V) {{subst}}:',
    V_r1:
      'Для нахождения массы через объем и плотность существует такая формула:',
    V_r2:
      'Из этой формулы выразим объем раствора {{subst}} (V<sub>р-ра</sub>) и вычислим его:',
    V_r3: 'Есть такая формула для нахождения молярной концентрации (С):',
    V_r4:
      'Из этой формулы выразим объем раствора (V<sub>р-ра</sub>) {{subst}}:',
    V_smesi1:
      'Для нахождения массы через объем и плотность существует такая формула:',
    V_smesi2:
      'Из этой формулы выразим объем смеси (V<sub>смеси</sub>) и вычислим его:',
    V_smesi3:
      'Объемная доля газа (φ) показывает, какую часть общего объема смеси занимает данный газ, и находится по формуле:',
    V_smesi4:
      'Отсюда выразим объем смеси (V<sub>смеси</sub>) {{subst}} и подставим объем вещества {{subst}} (V<sub>в-ва</sub>) и объемную долю вещества {{subst}} (φ) в этой смеси:',
    V_raspl1:
      'Для нахождения массы через объем и плотность существует такая формула:',
    V_raspl2:
      'Из этой формулы выразим объем расплава (V<sub>распл.</sub>) и вычислим его:',
    V_rud1:
      'Для нахождения массы через объем и плотность существует такая формула:',
    V_rud2:
      'Из этой формулы выразим объем руды (V<sub>руды</sub>) и вычислим его:',
    w_v1:
      'Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу раствора (m<sub>р-ра</sub>), записывается так:',
    w_v2:
      'Подставим массу вещества {{subst}} и массу его раствора и найдем массовую долю (ω):',
    w_v3:
      'Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу распплава (m<sub>распл.</sub>), записывается так:',
    w_v4:
      'Подставим массу вещества {{subst}} и массу расплава и найдем массовую долю (ω):',
    w_v5:
      'Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу руды (m<sub>руды</sub>), записывается так:',
    w_v6:
      'Подставим массу вещества {{subst}} и массу руды и найдем массовую долю (ω):',
    w_v7:
      'Формула, связывающая массовую долю вещества (ω), массу вещества (m<sub>в-ва</sub>) и массу смеси (m<sub>смеси</sub>), записывается так:',
    w_v8:
      'Подставим массу вещества ${subst} и массу смеси и найдем массовую долю (ω):',
    w_vyh1:
      'Массовая доля выхода (или выход, обозначается как ω<sub>вых.</sub>) - это отношение реальной массы вещества на выходе к теоретически возможной. Находится ω<sub>вых.</sub> по формуле:',
    w_vyh2:
      'Подставим практическую массу и теоретическую в формулу и посчитаем ω<sub>вых.</sub>:',
    fi1:
      'Объемная доля газа (φ) показывает, какую часть общего объема cмеси занимает данный газ, и находится по формуле:',
    fi2: 'Посчитаем по этой формуле объемную долю газа (φ):',
    fi_vyh1:
      'Объемная доля выхода (обозначается как φ<sub>вых.</sub>) - это отношение реального объема на выходе к теоретически возможному. Находится φ<sub>вых.</sub> по формуле:',
    fi_vyh2:
      'Подставим практический объем и теоретический в формулу и посчитаем φ<sub>вых.</sub>:',
    ro_v1:
      'Для нахождения массы через объем и плотность существует такая формула:',
    ro_v2: 'Из этой формулы выразим плотность {{subst}} (ρ) и вычислим ее:',
    ro_v3:
      'Плотность воды - величина всем известная, поэтому не так важно, что в условии о ней ничего не сказано. Плотность воды равна {{constants.ro_h2o.record}}г/дм<sup>3</sup>.',
    ro_r1:
      'Для нахождения массы через объем и плотность существует такая формула:',
    ro_r2:
      'Из этой формулы выразим плотность раствора (ρ<sub>р-ра</sub>) и вычислим ее:',
    ro_smesi1:
      'Для нахождения массы через объем и плотность существует такая формула:',
    ro_smesi2:
      'Из этой формулы выразим плотность смеси (ρ<sub>смеси</sub>) и вычислим ее:',
    ro_raspl1:
      'Из этой формулы выразим плотность расплава (ρ<sub>распл.</sub>) и вычислим ее:',
    ro_rud1:
      'Из этой формулы выразим плотность руды (ρ<sub>руды</sub>) и вычислим ее:',
    ma_v1:
      'Формула, связывающая количество структурных единиц (N), массу (m) и массу атома (m<sub>атома</sub>), записывается так:',
    ma_v2: 'Из этой формулы выразим массу атома вещества {{subst}}:',
    N_v1: 'Одна из формул для нохождения химического количества выглядит так:',
    N_v2:
      'Выражаем из нее число структурных единиц {{subst}} (N) и подставляем число Авогадро (N<sub>A</sub>; это постоянная величина, которая равна 6,02 × 10<sup>23</sup> моль<sup>-1</sup>) и химическое количество {{subst}} (n):',
    N_v3:
      'Подставим в формулу массу атома вещества и массу вещества, ведь они нам известны, и найдем количество структурных единиц:',
    P1:
      'Выразим из этого уравнения давление {{subst}} (P) и подставим объем {{subst}} (V), температуру газа (T), его химическое количество (n), а также газовую постоянную (R; это постоянная величина, которая равна {{constants.R.record}} Дж/(моль×K)):',
    T1:
      'Выразим из этого уравнения температуру {{subst}} (T) и подставим объем {{subst}} (V), давление газа (P), его химическое количество (n), а также газовую постоянную (R; это постоянная величина, которая равна {{constants.R.record}} Дж/(моль×K)):',
    C_v1:
      'Нам известно химическое количество (n) {{subst}} и  объем раствора (V<sub>р-ра</sub>), поэтому можем вычислить молярную концентрацию {{subst}} (C):',
    D_h1:
      'Относительная плотность вещества по водороду - это отношение молярной массы этого вещества к молярной массе водорода. Формула для расчета относительной плотности по водороду:',
    D_h2:
      'Молярную массу вещества и молярную массу водорода мы знаем, так что выразим из этой формулы относительную плотность по водороду и найдем её:',
    D_vozd1:
      'Относительная плотность вещества по воздуху - это отношение молярной массы этого вещества к молярной массе воздуха. Формула для расчета относительной плотности по воздуху:',
    D_vozd2:
      'Молярную массу вещества и молярную массу воздуха мы знаем, так что выразим из этой формулы относительную плотность по воздуху и найдем её:',
    unableToFind: 'Не удалось найти {{findFields.symbol}}',
    tryUsingPart:
      'Для поиска {{findFields.symbol}} попробуйте воспользоваться разделом:',
    knowFromTask: 'знаем из условия задачи:',
    chemicalAmountEquals:
      'Химическое количество {{substSteps.subst}} известно по условию задачи и равняется {{currentGiven.value}} моль.',
    calcMadeTo: 'Расчет будем вести по {{nHelpAnswers.subst}}',
    compareAmounts: 'Сравним химические количества {{subst1}} и {{subst2}}:',
    equalSo:
      'Они равны, поэтому расчет можно вести по любому из этих веществ. Давайте для дальнейших вычислений возьмем вещество {{subst}}',
    inLack: 'в недостатке',
    compareChemicalAmounts: 'Сравним химические количества ',
    isInExcess: '- в избытке',
    isInLack: '- в недостатке',
    lackExcessTasks:
      'Задачи на избыток и недостаток всегда решаются по недостатку, поэтому решаем задачу по ',
    proportionStep:
      'Составим пропорцию по уравнению реакции для нахождения химического количества ',
    proportionStep1: 'Найдем из пропорции x (то есть химическое количество ',
    unableToFind2: 'Не удалось найти ',
    forSearch:
      'Для поиска {{symbol}}({{subst}}) попробуйте воспользоваться разделом:',
    noResults: 'Не удалось ничего найти',
    doubleCheck:
      'Перепроверь, правильно ли все заполнено, или попробуй воспользоваться разделом:',
    noEquation:
      'Не удалось найти уравнение реакции. Проверьте правильность ввода',
    notReaction:
      'То, что вы ввели, не похоже на реакцию! Проверьте правильность ввода и попробуйте найти реакцию еще раз.',
    errorTryLater: 'Ошибка! Попробуйте позже или введите реакцию вречную.',
    tryEnteringManually:
      'Не удалось найти ни одной подходящей реакции. Попробуйте написать реакцию вручную.',
    necessaryEnterFullReaction:
      'Необходимо ввести полную реакцию с левой и правой частью. Например: "H2 + O2 = H2O"',
    noPlusSign: 'Не найдено ни одного знака "+" в вашей реакции.',
    unknownSubst:
      'В вашей реакции присутствуют неопознанные вещества. Элементы в веществах должны начинаться с большой буквы, например: "NaCl"',
    incorrectFormula: 'Неправильно введена формула вещества!',
    noSubstFormula: 'Вы не ввели формулу вещества!',
    noValue: 'Вы не ввели значение величины (поле "число" пустое)!',
    mustBeGreaterZero: 'Значение величины должно быть больше нуля!',
    noSubst: 'Вы не выбрали вещество!',
    field: 'Поле',
    for: 'для',
    alreadyFull: 'уже заполнено вами! Можете удалить его и заполнить заново',
    onlyOneAllowed:
      'Допускается только 1 вещество в "Найти". Если надо найти что-либо у нескольких разных веществ, запускайте решатель заново отдельно для каждого вещества.',
  },
  [LOCALES.en]: {
    title: 'Solution of tasks',
    examples: 'Examples',
    yes: 'Yes',
    no: 'No',
    next: 'Next',
    solve: 'Solve',
    search: 'Searching...',
    answer: 'Answer:',
    given: 'Given:',
    find: 'Find:',
    detailed: 'Detailed',
    close: 'Close',
    entering: 'Entering:',
    enter: 'Enter',
    enterReactionManually: 'Enter reaction manually',
    reactionQuestion: 'Does the task say anything about the running reaction?',
    formulasForSolution: 'Formulas for task solution',
    reactionDescription:
      '"Yes", if one substance is obtained from another one, one thing is added to another, the substance is burning, oxidizing, etc.',
    substanceQuestion: 'Is the substance known',
    substanceDescription:
      '"Yes" if it has been said in the task: "find the mass of sodium", "the "volume of NaOH is 40 liters", "iron ore", but not: "volume of substance", "mass of substance"...',
    substanceQuestionFirstCondition:
      '"The mass of potassium is known and equals 145 grams, find its chemical amount n."',
    substanceQuestionSecondCondition:
      '"Find the chemical amount of magnesium contained in magnesium ore whose mass is 500 grams with the mass content of magnesium of 40%?"',
    substanceQuestionThirdCondition:
      '"The mass of the substance is 20 grams, its molar mass is 100 gr/mole. Find the chemical amount of the substance"',
    problemGivenHelpText: 'Write down what is given according to the task:',
    problemFindHelpText: 'Write down what is to find:',
    reactionFindHintText: 'You can write the whole reaction yourself:',
    reactionFindUseSearch: 'Use search to find the required reaction.',
    reactionFindExample:
      'For example, if it\'s said in the task: "Hydrogen is reacting with oxygen", enter:',
    reactionFindAnotherExample: 'Other examples',
    reactionFindExamples: 'Examples of reactions search',
    reactionFindFirstCondition: '"Potassium is interacting with water..."',
    reactionFindSecondCondition:
      '"What chemical amounts of barium oxide and sulfuric acid will be required to produce 100 barium sulfate?"',
    reactionFindThirdCondition:
      '"Hydrochloric acid has reacted with 13 grams of zinc..."',
    reactionFindFourthCondition:
      '"As a result of the reaction of hydrochloric acid of the chemical amount of 2 moles with unspecified salt, there was formed CaCl2 of the mass of 300 grams..."',
    select: 'Select',
    enterFullReaction: 'Enter full reaction, can be without coefficients.',
    forExample: 'For example: ',
    enterSubstanceFormula: 'Enter substance formula',
    correctEntry: 'Correct entry: ',
    incorrectEntry: 'Incorrect entry: ',
    incorrectExampleSodiumChloride: 'sodium chloride',
    substanceExample: 'For example:  Cu(OH)2',
    isReactionRunning: 'Is reaction running?',
    isReactionRunningFirstCondition:
      '"Hydrochloric acid has reacted with 13 grams of zinc. Find the w of expended acid and obtained salt, also find the volume of evolved gas."',
    isReactionRunningSecondCondition:
      '"The mass content of iron in ironstone is 75%, find the mass of iron ore if the chemical amount of iron is 2 moles."',
    isReactionRunningAnswer: 'Is reaction running: ',
    generateExplanation1:
      "Let's open the periodic table and calculate molar mass of {{substB}} by adding molar masses of elementary substances which consist in this substance.",
    generateExplanation2:
      'You can find more detailed information in the part "Find molar mass"',
    generateExplanation3:
      "Let's open the periodic table and find the molar mass of {{substB}}",
    generateExplanation4:
      "Let's write down the formula of calculating chemical amount (n) with mass (m) and molar mass (M) of substance:",
    generateExplanation5:
      'Expressing molar mass (M) from the formula. Chemical amount (n) and mass (m) are known, so we can find molar mass (M):',
    generateExplanation6:
      'Relative density of substance to hydrogen is the relation of the molar mass of this substance to the molar mass of hydrogen. Formula for calculation of relative density to hydrogen:',
    generateExplanation7:
      'We know the molar mass of hydrogen and relative density to hydrogen, so we can express molar mass of this substance (M) and find it:',
    generateExplanation8:
      'Relative density of substance to air is the relation of the molar mass of this substance to the molar mass of air. Formula for calculation of relative density to air:',
    generateExplanation9:
      'We know the molar mass of air and relative density to air, so we can express molar mass of this substance (M) and find it:',
    generateExplanation10:
      'Relative molecular mass numerically equals molar mass and we know it.',
    m_v1:
      "Let's express the mass of the substance from this formula and find its value:",
    formulaConnectingMPV:
      'Formula connecting mass(m), density (ρ) and volume (V) is the following:',
    m_v3: 'According to this formula we can find mass of {{subst}}',
    m_v4:
      'Formula connecting number of recurring units (N), mass (m) и mass of atom (m<sub>atom</sub>) is the following:',
    m_vExpressMassFromFormula:
      'We can express the mass of substance of {{subst}}:',
    m_v6:
      'Formula connecting mass content of the substance (ω), mass of substance (m<sub>subs.</sub>) and mass of solution (m<sub>sol.</sub>) is the following:',
    m_v7:
      'Formula connecting mass content of the substance (ω), mass of substance (m<sub>subs.</sub>) and mass of mixture (m<sub>mix</sub>) is the following:',
    m_v8:
      'Formula connecting mass content of the substance (ω), mass of substance (m<sub>subs.</sub>) and mass of melt (m<sub>melt</sub>) is the following:',
    m_v9:
      'Formula connecting mass content of the substance (ω), mass of substance (m<sub>subs.</sub>) and mass of ore (m<sub>ore</sub>) is the following:',
    m_r2: 'According to this formula we can find solution mass of {subst}:',
    m_r3:
      'This is how formula connecting mass content of the substance (ω), mass of substance (m<sub>subs.</sub>) and mass of solution (m<sub>sol.</sub>) looks like:',
    m_r4: 'We can express the solution mass of {{subst}}:',
    m_smesi2:
      'According to this formula we can find mass of mixture of {{subst}}:',
    m_smesi3:
      'This is how formula connecting mass content of the substance (ω), mass of substance (m<sub>subs.</sub>) и mass of mixture (m<sub>mix</sub>) looks like:',
    m_smesi4: 'We can express the mixture mass of {{subst}}:',
    m_raspl1: 'According to this formula we can find melt mass of {{subst}}:',
    m_raspl2:
      'This is how formula connecting mass content of the substance (ω), mass of substance (m<sub>subs.</sub>) и mass of melt (m<sub>melt</sub>) looks like:',
    m_raspl3: 'We can express the mass of melt of {{subst}}:',
    m_rud1: 'According to this formula we can find ore mass of {{subst}}:',
    m_rud2:
      'This is how formula connecting mass content of the substance (ω), mass of substance (m<sub>subs.</sub>) и mass of ore (m<sub>sol.</sub>) looks like:',
    m_rud3: 'We can express the ore mass of {{subst}}:',
    n_v1: 'There is formula for calculating molar concentration (С):',
    n_v2:
      "Let's express chemical amount (n) {{subst}} and apply molar concentration {{subst}} (C) and volume of solution {{subst}} (V<sub>sol.</sub>) to it:",
    n_v3: 'Chemical amount is calculated with formula:',
    n_v4:
      "Let's apply to this formula the mass of {{subst}} and molar mass of {{subst}} and find the chemical amount:",
    n_v5:
      'By this means formula for calculating molar volume is the following:',
    n_v6:
      "Let's express from chemical amount (n) {{subst}} from the formula and apply to it molar volume {{subst}} (V<sub>n</sub>) and volume {{subst}} (V):",
    n_v7: 'Volume of gas can be calculated with this formula:',
    n_v8:
      'Expressing chemical amount of {{subst}} (n) from this formula and apply to it volume of {{subst}} (V) and molar volume of gas under normal conditions (V<sub>n</sub>; this is constant which equals 22,4 dm<sup>3</sup>):',
    n_v9: 'Chemical amount is calculated with formula:',
    n_v10:
      "Let's apply the number of recurring units of {{subst}} (N) Avogadro's number (N<sub>A</sub>; this is constant which equals 6,02 × 10<sup>23</sup> mole<sup>-1</sup>) to this formula and calculate chemical amount of {{subst}}:",
    n_v11: "Let's write down the general gas equation:",
    n_v12:
      'Expressing chemical amount of (n) {{subst}} from the formula and applying to it volume of {{subst}} (V), gas pressure (P), its temperature (T) and gas constant (R; this is constant which equals {{constants.R.record}} J/(mole×K)):',
    V_v1: 'There is formula for calculating mass by volume and density:',
    V_v2: 'Expressing volume of {{subst}} (V) from the formula calculating it:',
    V_v3:
      'Expressing volume (V) of {{subst}} from the formula and applying to it chemical amount of {{subst}} (n), gas pressure (P), its temperature (T) and gas constant (R; this is constant which equals {{constants.R.record}} J/(mole×K)):',
    V_v4: 'Volume of gas can be calculated with this formula:',
    V_v5:
      "Let's express chemical amount of {{subst}} (n) and molar volume under normal conditions (V<sub>n</sub>; this is constant which equals 22,4 dm<sup>3</sup>):",
    V_v6:
      'Gas volume fraction (φ) shows the part that gas occupies in the mixture volume. It can be calculated this way:',
    V_v7:
      "Let's express substance volume (V<sub>subs</sub>) {{subst}} from it and apply mixture volume (V<sub>mix</sub>) and gas volume fraction (φ) to it:",
    V_v8:
      'By this means formula for calculating molar volume is the following:',
    V_v9:
      'Expressing the volume (V) of {{subst}} and apply molar volume of {{subst}} (V<sub>n</sub>) and chemical amount of {{subst}} (n) to it:',
    V_n1:
      'By this means formula for calculating molar volume is the following:',
    V_n2:
      'Applying chemical amount (n) {{subst}} and volume (V) {{subst}} to it:',
    V_r1: 'There is formula for calculating mass by volume and density:',
    V_r2:
      'Expressing solution volume {{subst}} (V<sub>sol.</sub>) from the formula and calculating it:',
    V_r3: 'There is formula for calculating molar concentration (С):',
    V_r4: "Let's express solution volume (V<sub>sol.</sub>) {{subst}}",
    V_smesi1: 'There is formula for calculating mass by volume and density:',
    V_smesi2:
      "Let's express mixture volume (V<sub>mix</sub>) and calculate it:",
    V_smesi3:
      'Gas volume fraction (φ) shows the part that gas occupies in the mixture volume. It can be calculated this way:',
    V_smesi4:
      "Let's express mixture volume (V<sub>mix</sub>) {{subst}} and apply substance volume {{subst}} (V<sub>subs,</sub>) gas volume fraction {{subst}} (φ) in this mixture:",
    V_raspl1: 'There is formula for calculating mass by volume and density:',
    V_raspl2:
      "Let's express volume of melt (V<sub>melt</sub>) and calculate it:",
    V_rud1: 'There is formula for calculating mass by volume and density:',
    V_rud2: "Let's express volume of ore (V<sub>ore</sub>) and calculate it:",
    w_v1:
      'This is how formula connecting mass content of the substance (ω), mass of substance (m<sub>subs.</sub>) and solution mass (m<sub>sol.</sub>) looks like:',
    w_v2:
      'Applying the mass of substance {{subst}} and mass of its solution and calculating mass content (ω):',
    w_v3:
      'This is how formula connecting mass content of the substance (ω), mass of substance (m<sub>subs.</sub>) and mass of melt (m<sub>melt</sub>) looks like:',
    w_v4:
      'Applying the mass of substance {{subst}} and mass of its melt and calculating mass content (ω):',
    w_v5:
      'Formula connecting mass content of the substance (ω), mass of substance (m<sub>subs.</sub>) and mass of ore (m<sub>ore</sub>) is the following:',
    w_v6: 'We can express the mass of substance of {{subst}}:',
    w_v7:
      'Formula connecting mass content of the substance (ω), mass of substance (m<sub>subs.</sub>) и mass of mixture (m<sub>mix</sub>) is the following:',
    w_v8:
      'Applying the mass of substance {{subst}} and mass of mix and calculating mass content (ω):',
    w_vyh1:
      'Mass content of yield (or yield, labeled as ω<sub>yield</sub>) is relation of real substance mass to theoretically possible. You can find ω<sub>yield</sub> with this formula:',
    w_vyh2:
      'Applying to the formula real mass and theoretical mass we can calculate ω<sub>yield</sub>:',
    fi1:
      'Gas volume fraction (φ) shows the part that gas occupies in the mixture volume. It can be calculated this way:',
    fi2: 'Calculating gas volume fraction (φ):',
    fi_vyh1:
      'Volume content of yield (labeled as φ<sub>yield</sub>) is a relation of real substance volume to theoretically possible. You can find φ<sub>yield</sub> with this formula:',
    fi_vyh2:
      'Applying to the formula real volume and theoretical volume we can calculate φ<sub>yield</sub>:',
    ro_v1: 'There is formula for calculating mass by volume and density:',
    ro_v2:
      'Expressing density {subst} (ρ) from the formula and calculating it:',
    ro_v3:
      "Density of water is a known quantity, so it doesn't matter that there is no information about it in the task. Density of water equals {{constants.ro_h2o.record}}g/dm<sup>3</sup>.",
    ro_r1: 'There is formula for calculating mass by volume and density:',
    ro_r2:
      'Expressing substance density (ρ<sub>sol.</sub>) from the formula and calculating it:',
    ro_smesi1: 'There is formula for calculating mass by volume and density:',
    ro_smesi2:
      "Let's express density of mix (ρ<sub>mix</sub>) from the formula and calculate it:",
    ro_raspl1:
      "Let's express density of melt (ρ<sub>ore</sub>) from the formula and calculate it:",
    ro_rud1:
      "Let's express density of ore (ρ<sub>ore</sub>) from the formula and calculate it:",
    ma_v1:
      'Formula connecting number of recurring units (N), mass (m) и mass of atom (m<sub>atom</sub>) is the following:',
    ma_v2: "Let's express mass of atom of substance {{subst}}:",
    N_v1:
      'One of the formulas for calculating chemical amount looks like this:',
    N_v2:
      "Expressing from it the number of recurring units {{subst}} (N) and applying Avogadro's number (N<sub>A</sub>; this is a constant which equals 6,02 × 10<sup>23</sup> mole<sup>-1</sup>) and chemical amount {{subst}} (n):",
    N_v3:
      'Applying to the formula mass of atom of substance and substance mass (since we know them) and calculating the number of recurring units:',
    P1:
      'Expressing pressure {{subst}} (P) from it and applying volume {{subst}} (V), temperature of gas (T), its chemical amount (n) and gas constant (R; this is a constant which equals {{constants.R.record}} J/(mole×K)):',
    T1:
      'Expressing temperature {{subst}} (T) from it and applying volume {{subst}} (V), gas pressure (P), its chemical amount (n) and gas constant (R; this is a constant which equals {{constants.R.record}} J/(mole×K)):',
    C_v1:
      "We know chemical amount (n) {{subst}} and solution volume (V<sub>sol.</sub>), that's why we can calculate molar concentration {{subst}} (C):",
    D_h1:
      'Relative density of substance to hydrogen is the relation of the molar mass of this substance to the molar mass of hydrogen. Formula for calculation of relative density to hydrogen:',
    D_h2:
      'We know the molar mass of hydrogen and molar mass of substance, so we can express relative density to hydrogen and find it:',
    D_vozd1:
      'Relative density of substance to air is the relation of the molar mass of this substance to the molar mass of air. Formula for calculation of relative density to air:',
    D_vozd2:
      'We know the molar mass of air and molar mass of substance, so we can express relative density to air and find it:',
    unableToFind: 'Unable to find {{findFields.symbol}}',
    tryUsingPart: 'For searching {{findFields.symbol}} try using part:',
    knowFromTask: 'we know this from task:',
    chemicalAmountEquals:
      'Chemical amount {{substSteps.subst}} is known and equals {{currentGiven.value}} mole.',
    calcMadeTo: 'Calculation will be made to {{nHelpAnswers.subst}}',
    compareAmounts:
      "Let's compare chemical amounts of {{subst1}} and {{subst2}}:",
    equalSo:
      "They are equal, so calculations can be made to any of them. For further calculations let's work with substance {{subst}}",
    inLack: 'in lack',
    compareChemicalAmounts: "Let's compare chemical amounts of ",
    isInExcess: 'is in excess',
    isInLack: 'is in lack',
    lackExcessTasks:
      "Such tasks are solved according to the substance which is in lack, that's why we will solve it to ",
    proportionStep:
      "Let's make the proportion of reaction equation for finding chemical amount of ",
    proportionStep1: 'Finding x from proportion (i.e. chemical of ',
    unableToFind2: 'Unable to find ',
    forSearch: 'For searching {{symbol}}({{subst}}) try using part:',
    noResults: 'No results found',
    doubleCheck: 'Double check if everything is fulfilled or use the part:',
    noEquation: 'No reaction equation found. Check the input',
    notReaction:
      "It doesn't look like reaction! Check the input and try to find reaction again.",
    errorTryLater: 'Error! Try later or enter the reaction manually.',
    tryEnteringManually:
      'No suitable reaction found. Try to enter the reaction manually.',
    necessaryEnterFullReaction:
      'It\'s necessary to enter the full reaction with the left and right parts. For example: "H2 + O2 = H2O"',
    noPlusSign: 'No "+" found in your reaction.',
    unknownSubst:
      'There are unknown substances in your reaction. Elements in substances should start with capital letters, for example: "NaCl"',
    incorrectFormula: 'Substance formula was entered incorrectly!',
    noSubstFormula: "You haven't entered the substance formula!",
    noValue: 'You haven\'t entered the value (field "number" is empty)!',
    mustBeGreaterZero: 'The value must be more than zero!',
    noSubst: "You haven't selected the substance!",
    field: 'Field',
    for: 'for',
    alreadyFull:
      'already fulfilled by you! You can delete it and enter it again',
    onlyOneAllowed:
      'Only one substance is allowed in "Search". If you need to find something for several different substances, run the solver again for every substance.',
  },
};
