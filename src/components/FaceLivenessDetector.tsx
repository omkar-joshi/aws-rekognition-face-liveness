import React, { useState } from "react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { Loader, ThemeProvider } from "@aws-amplify/ui-react";

export function LivenessQuickStartReact() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [createLivenessApiData, setCreateLivenessApiData] = useState<{
    sessionId: string;
  } | null>(null);
  const [livenessResult, setLivenessResult] = useState(null);

  React.useEffect(() => {
    const fetchCreateLiveness: () => Promise<void> = async () => {
      const response = await fetch(
        "https://mnqvx826lg.execute-api.us-east-1.amazonaws.com/dev/createFaceLivenessSession"
      );
      const sessionData = await response.json();
      setCreateLivenessApiData(sessionData);
      setLoading(false);
    };

    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete: () => Promise<void> = async () => {
    const response = await fetch(
      `https://mnqvx826lg.execute-api.us-east-1.amazonaws.com/dev/getFaceLivenessResult?sessionId=${createLivenessApiData?.sessionId}`
    );
    const data = await response.json();

    setLivenessResult(data);
    if (data.isLive) {
      console.log("User is live >>> ", data);
    } else {
      console.log("User is not live >>> ", data);
    }
  };

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (
        <>
          <FaceLivenessDetector
            sessionId={createLivenessApiData?.sessionId || ""}
            region="us-east-1"
            onAnalysisComplete={handleAnalysisComplete}
            onError={(error) => {
              console.error(error);
            }}
          />
          <br />
          {JSON.stringify(livenessResult)}
        </>
      )}
    </ThemeProvider>
  );
}
