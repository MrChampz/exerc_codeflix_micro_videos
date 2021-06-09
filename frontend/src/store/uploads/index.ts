import { createActions, createReducer } from "reduxsauce";
import update from "immutability-helper";
import { Actions, AddUploadAction, RemoveUploadAction, SetUploadErrorAction, State, UpdateProgressAction } from "./types";

export const { Types, Creators } = createActions<{
  ADD_UPLOAD: string,
  REMOVE_UPLOAD: string,
  UPDATE_PROGRESS: string,
  SET_UPLOAD_ERROR: string,
}, {
  addUpload(payload: AddUploadAction['payload']): AddUploadAction,
  removeUpload(payload: RemoveUploadAction['payload']): RemoveUploadAction,
  updateProgress(payload: UpdateProgressAction['payload']): UpdateProgressAction,
  setUploadError(payload: SetUploadErrorAction['payload']): SetUploadErrorAction,
}>({
  addUpload: ['payload'],
  removeUpload: ['payload'],
  updateProgress: ['payload'],
  setUploadError: ['payload'],
});

export const INITIAL_STATE: State = {
  uploads: []
};

const reducer = createReducer<State, Actions>(INITIAL_STATE, {
  [Types.ADD_UPLOAD]: addUpload,
  [Types.REMOVE_UPLOAD]: removeUpload,
  [Types.UPDATE_PROGRESS]: updateProgress,
  [Types.SET_UPLOAD_ERROR]: setUploadError,
});

function addUpload(state = INITIAL_STATE, action: AddUploadAction): State {
  if (!action.payload.files.length) {
    return state;
  }

  const index = findUploadIndex(state, action.payload.video.id);
  if (index !== -1 && state.uploads[index].progress < 1) {
    return state;
  }

  const uploads = index === -1
    ? state.uploads
    : update(state.uploads, {
      $splice: [[index, 1]]
    });

  return {
    uploads: [
      ...uploads,
      {
        video: action.payload.video,
        progress: 0,
        files: action.payload.files.map(file => ({
          fileField: file.fileField,
          fileName: file.file.name,
          progress: 0,
        })),
      }
    ]
  }
}

function removeUpload(state = INITIAL_STATE, action: RemoveUploadAction): State {
  const uploads = state.uploads.filter(upload =>
    upload.video.id !== action.payload.id
  );
  
  if (uploads.length === state.uploads.length) {
    return state;
  }

  return { uploads };
}

function updateProgress(state = INITIAL_STATE, action: UpdateProgressAction): State {
  const videoId = action.payload.video.id;
  const fileField = action.payload.fileField;
  const { uploadIndex, fileIndex } = findUploadAndFileIndices(state, videoId, fileField);

  if (typeof uploadIndex === 'undefined') {
    return state;
  }

  const upload = state.uploads[uploadIndex];
  const file = upload.files[fileIndex];

  if (file.progress === action.payload.progress) {
    return state;
  }

  const uploads = update(state.uploads, {
    [uploadIndex]: {
      $apply (upload) {
        const files = update(upload.files, {
          [fileIndex]: {
            $set: { ...file, progress: action.payload.progress }
          }
        });
        const progress = calculateGlobalProgress(files);
        return { ...upload, progress, files };
      },
    }
  });

  return { uploads };
}

function setUploadError(state = INITIAL_STATE, action: SetUploadErrorAction): State {
  const videoId = action.payload.video.id;
  const fileField = action.payload.fileField;
  const { uploadIndex, fileIndex } = findUploadAndFileIndices(state, videoId, fileField);

  if (typeof uploadIndex === 'undefined') {
    return state;
  }

  const upload = state.uploads[uploadIndex];
  const file = upload.files[fileIndex];

  const uploads = update(state.uploads, {
    [uploadIndex]: {
      files: {
        [fileIndex]: {
          $set: { ...file, error: action.payload.error, progress: 1 },
        },
      }
    }
  });

  return { uploads };
}

function findUploadAndFileIndices(
  state: State,
  videoId: string,
  fileField: string
): { uploadIndex?, fileIndex? } {

  const uploadIndex = findUploadIndex(state, videoId);
  if (uploadIndex === -1) {
    return {};
  }

  const upload = state.uploads[uploadIndex];
  const fileIndex = findFileIndex(upload.files, fileField);
  if (fileIndex === -1) {
    return {};
  }

  return { uploadIndex, fileIndex };
}

function findUploadIndex(state: State, id: string) {
  return state.uploads.findIndex(upload => upload.video.id === id);
}

function findFileIndex(files: Array<{ fileField: string }>, fileField: string) {
  return files.findIndex(file => file.fileField === fileField);
}

function calculateGlobalProgress(files: Array<{ progress }>) {
  const fileCount = files.length;
  if (!fileCount) {
    return 0;
  }

  const progressSum = files.reduce((sum, file) => sum += file.progress, 0);

  return progressSum / fileCount;
}

export default reducer;