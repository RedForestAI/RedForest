import React, { useState, createContext } from "react";

export const InAssignmentContext = createContext({
  inAssignment: false,
  setInAssignment: (inAssignment: boolean) => {},
  uploadingSession: false,
  setUploadingSession: (uploadingSession: boolean) => {},
  afterUploadHref: "",
  setAfterUploadHref: (afterUploadHref: string) => {},
});

export const InAssignmentProvider = (props: { children: any }) => {
  const [inAssignment, setInAssignment] = useState<boolean>(false);
  const [uploadingSession, setUploadingSession] = useState<boolean>(false);
  const [afterUploadHref, setAfterUploadHref] = useState<string>("");

  return (
    <InAssignmentContext.Provider
      value={{
        inAssignment,
        setInAssignment,
        uploadingSession,
        setUploadingSession,
        afterUploadHref,
        setAfterUploadHref,
      }}
    >
      {props.children}
    </InAssignmentContext.Provider>
  );
};
