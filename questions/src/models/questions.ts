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

const updateQuestion = async (
  id: string,
  title: string,
  description: string
) => {
  const updatedQuestion = await QuestionModel.findByIdAndUpdate(
    id,
    { title, description },
    { new: true }
  );
  return updatedQuestion?.toObject();
};

const deleteQuestion = async (id: string) => {
  const deletedQuestion = await QuestionModel.findByIdAndDelete(id);
  return deletedQuestion?.toObject();
};

export const QuestionDao = {
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
