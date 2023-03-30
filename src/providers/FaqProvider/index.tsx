import axios from 'axios';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toast';

export type FaqType = {
  id: string;
  value: string;
};

export type FaqListType = Array<FaqType>;

type ContextProps = {
  faqQuestion: FaqListType;
  faqAnswer: FaqListType;
  setFaqQuestion: React.Dispatch<React.SetStateAction<FaqListType>>;
  setFaqAnswer: React.Dispatch<React.SetStateAction<FaqListType>>;
  loadingFaq: boolean;
};

type Props = {
  children: ReactNode;
};

type FaqResponseType = {
  id: number;
  acf: {
    Question: string;
    answer: string;
  };
};

export const FaqContext = createContext<ContextProps>({
  setFaqQuestion: () => {},
  setFaqAnswer: () => {},
  loadingFaq: true,
  faqQuestion: [],
  faqAnswer: [],
});

export const FaqProvider = ({ children }: Props) => {
  const [faqQuestion, setFaqQuestion] = useState<FaqListType>([]);
  const [faqAnswer, setFaqAnswer] = useState<FaqListType>([]);
  const [loadingFaq, setLoadingFaq] = useState(true);
  const faqAPI = `${process.env.REACT_APP_V3_API_URL ?? ''}/faq`;

  const getFaqList = async () => {
    setLoadingFaq(true);
    setFaqQuestion([]);
    setFaqAnswer([]);

    try {
      const faqList = await axios.get(faqAPI);
      faqList.data.forEach((faq: FaqResponseType) => {
        setFaqQuestion(prevQuestions => [...prevQuestions, { id: faq.id.toString(), value: faq.acf.Question }]);
        setFaqAnswer(prevAnswers => [...prevAnswers, { id: faq.id.toString(), value: faq.acf.answer }]);
      });
      setLoadingFaq(false);
    } catch (error: any) {
      toast.error(error.message);
      setLoadingFaq(false);
    }
  };

  useEffect(() => {
    getFaqList();
    // eslint-disable-next-line
  }, []);

  return (
    <FaqContext.Provider
      value={{
        faqQuestion,
        setFaqQuestion,
        faqAnswer,
        setFaqAnswer,
        loadingFaq,
      }}
    >
      {children}
    </FaqContext.Provider>
  );
};
