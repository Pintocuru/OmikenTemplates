// src/configMaker/dev/devTypes.ts

export interface FileItem {
 name: string;
 displayName: string;
 modified: string;
}

export interface DevConfigsState {
 saveFileName: string;
 availableFiles: FileItem[];
 isSaving: boolean;
 isLoading: boolean;
 isDeleting: boolean;
 isLoadingFileList: boolean;
 isExecutingConfirm: boolean;
 isServerConnected: boolean;
 showConfirmModal: boolean;
 showErrorModal: boolean;
 showSuccessMessage: boolean;
 errorMessage: string;
 successMessage: string;
 confirmMessage: string;
 pendingAction: (() => Promise<void>) | null;
}
