/* eslint-disable react/prop-types */
import React from 'react';
import { useRouter } from 'next/router';
// import { Lottie } from '@crello/react-lottie';
// import db from '../../../db.json';
import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import AlternativesForm from '../../components/AlternativesForm';
import Button from '../../components/Button';
import BackLinkArrow from '../../components/BackLinkArrow';

// import loadingAnimation from './animations/loading.json';

function ResultWidget({ results }) {
  const router = useRouter();
  const { name } = router.query;

  const resultQuestions = results.filter((x) => x).length;

  return (
    <Widget>
      <Widget.Header>Resultado:</Widget.Header>
      {resultQuestions === 0 && (
        <img
          alt="Descrição"
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
          }}
          src="https://i.pinimg.com/originals/f9/80/3b/f9803b18a87e275682c6ca6ca10419a0.gif"
        />
      )}
      {resultQuestions !== 0 && (
        <img
          alt="Descrição"
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
          }}
          src="https://1.bp.blogspot.com/-P0DJ2puHqnA/UjNxjbnhQeI/AAAAAAAAAec/1ClCmHNKF7U/s1600/tumblr_mob13gDScv1sr90jxo1_500.gif"
        />
      )}

      <Widget.Content>
        <p>{`${resultQuestions === 0 ? 'Que pena!!' : 'Mandou bem!!'} ${name} `}</p>
        <p>{resultQuestions === 0 ? 'Você errou todas' : `${name} acertou ${resultQuestions} pergunta(s)`}</p>
      </Widget.Content>
    </Widget>
  );
}

function LoadingWidget() {
  return (
    <>
      <Widget.Header>Carregando...</Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '300px',
          objectFit: 'cover',
        }}
        src="https://i.pinimg.com/originals/82/1a/c1/821ac14d1fc011268367c04b66035f97.gif"
      />
    </>
  );
}

function QuestionWidget({ question, questionIndex, totalQuestions, onSubmit, addResult }) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>

        <AlternativesForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            setIsQuestionSubmited(true);
            setTimeout(() => {
              addResult(isCorrect);
              onSubmit();
              setIsQuestionSubmited(false);
              setSelectedAlternative(undefined);
            }, 10 * 1000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onClick={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          {isQuestionSubmited ? (
            <>
              {isCorrect && (
                <Button style={{ color: '#fff', backgroundColor: '#673ab7', marginBottom: '0' }}>Você acertou!</Button>
              )}

              {!isCorrect && (
                <Button style={{ color: '#fff', backgroundColor: '#b71c1c', marginBottom: '0' }}>Você errou!</Button>
              )}
            </>
          ) : (
            <Button type="submit" disabled={!hasAlternativeSelected}>
              Confirmar
            </Button>
          )}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};
export default function QuizPage({ externalQuestions, externalBg }) {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = externalQuestions[questionIndex];
  const totalQuestions = externalQuestions.length;
  const bg = externalBg;

  function addResult(result) {
    // results.push(result);
    setResults([...results, result]);
  }

  React.useEffect(() => {
    // fetch() ...
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 2000);
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}
