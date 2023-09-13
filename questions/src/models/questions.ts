import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const QuestionModel = mongoose.model("Question", QuestionSchema);

const getQuestionById = async (id: string) =>
  QuestionModel.findById(id).then((question) => question?.toObject());
const createQuestion = async (title: string, description: string) => {
  const question = new QuestionModel({ title, description });
  return question.save().then((question) => question.toObject());
};

export const QuestionDao = {
  getQuestionById,
  createQuestion,
};
