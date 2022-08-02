import {combineReducers} from 'redux';
import noticereducer from './noticereducer';
import galleryreducer from './galleryreducer'
import pollreducer from './pollreducer';

const reducers=combineReducers({
   notice:noticereducer,
   gallery:galleryreducer,
   poll:pollreducer
})
export default reducers;