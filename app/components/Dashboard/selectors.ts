export const getModalDisplayStatus = (state) => state.dashboard.dialog.show;

export const getModalType = (state) => state.dashboard.dialog.type;

export const getModalText = (state) => state.dashboard.dialog.text;

export const getModalOnSuccess = (state) => state.dashboard.dialog.onSuccess;

export const getModalData = (state) => state.dashboard.dialog;

export const getTestNetShowFlag = (state) => state.dashboard.testNet?.show;
