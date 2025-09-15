import { createStore } from 'vuex';
import account from './modules/account';
import course from './modules/course';
import modal from './modules/modal';
import subject from './modules/subject';
import exam from './modules/exam';
import question from './modules/question';
import comments from './modules/comments';

export default createStore({
  modules: {
    account,
    course,
    modal,
    subject,
    exam,
    question,
    comments
  }
});
