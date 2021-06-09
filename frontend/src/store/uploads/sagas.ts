import { END, eventChannel } from "redux-saga";
import { take, actionChannel, call, put } from "redux-saga/effects";
import { AddUploadAction, FileInfo } from "./types";
import { Creators, Types } from ".";
import { Video } from "../../util/models";
import VideoResource from "../../util/http/video-resource";

export function* uploadWatcherSaga() {
  const newFilesChannel = yield actionChannel(Types.ADD_UPLOAD);

  while (true) {
    const { payload }: AddUploadAction = yield take(newFilesChannel);
    for (const fileInfo of payload.files) {
      try {
        const response = yield call(uploadFile, payload.video, fileInfo);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  }
}

function* uploadFile(video: Video, fileInfo: FileInfo) {
  const channel = yield call(sendUpload, video.id, fileInfo);
  while (true) {
    try {
      const { progress, response } = yield take(channel);
      
      if (response) {
        return response;
      }
      
      yield put(Creators.updateProgress({
        video,
        progress,
        fileField: fileInfo.fileField,
      }));
    } catch (error) {
      yield put(Creators.setUploadError({
        video,
        error,
        fileField: fileInfo.fileField,
      }));
      throw error;
    }
  }
}

function sendUpload(videoId: string, fileInfo: FileInfo) {
  return eventChannel(emitter => {
    VideoResource.partialUpdate(videoId, {
      _method: 'PATCH',
      [fileInfo.fileField]: fileInfo.file,
    }, {
      http: { usePost: true },
      config: {
        headers: {
          'x-ignore-loading': true,
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          if (progressEvent.lengthComputable) {
            const progress = progressEvent.loaded / progressEvent.total;
            emitter({ progress });
          }
        }
      }
    }).then(response => emitter({ response }))
      .catch(error => emitter(error))
      .finally(() => emitter(END));
    
    const unsubscribe = () => {};
    return unsubscribe;
  });
}