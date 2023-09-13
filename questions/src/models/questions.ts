import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    validate: {
      validator: (title: string) => title.length > 0,
      message: "Title is required",
    },
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
    ValidityState: {
      values: ["Easy", "Medium", "Hard"],
      message: "{VALUE} is not supported",
    },
  },
  tags: {
    type: Array,
    required: true,
    validate: {
      validator: (tags: [String]) => tags.length > 0,
      message: "At least one tag is required",
    },
  },
  description: {
    type: String,
    required: true,
    validate: {
      validator: (description: string) => description.length > 0,
      message: "Description is required",
    },
  },
});

export const QuestionModel = mongoose.model("Question", QuestionSchema);

const getQuestionById = async (id: string) =>
  QuestionModel.findById(id).then((question) => question?.toObject());

const createQuestion = async (
  title: string,
  description: string,
  tags: [String],
  difficulty: string
) => {
  const question = new QuestionModel({ title, description, tags, difficulty });
  return question.save().then((question) => question.toObject());
};

const updateQuestion = async (
  id: string,
  title: string,
  description: string,
  tags: [String],
  difficulty: string
) => {
  const updatedQuestion = await QuestionModel.findByIdAndUpdate(
    id,
    { title, description, tags, difficulty },
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
