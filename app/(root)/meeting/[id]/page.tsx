'use client';

import { useState,useEffect } from 'react';
// import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useParams, useSearchParams } from 'next/navigation';
import { Loader } from 'lucide-react';

import { useGetCallById } from '@/hooks/useGetCallById';
import Alert from '@/components/Alert';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';

const MeetingPage = () => {
  const { id } = useParams();
  const searchParam = useSearchParams();
  const owner = searchParam.get('roomOwner');
  console.log(owner, 'owner');
  const { useCallEndedAt} = useCallStateHooks();
  const callEndedAt = useCallEndedAt();
  const callHasEnded = !!callEndedAt;
  // const { isLoaded, user } = useUser();
  const user = {id:owner}
  const isLoaded = true
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    //
    call?.camera?.disable();
    //
    if (owner && call) {
      call && call?.microphone?.enable();
      // alert('microphone enabled');
    } else {
      call && call?.microphone.disable();
      // alert('microphone disabled');
    }
    call && call.join();
    // if (isMicCamToggled) {
    //   call.camera.disable();
    //   call.microphone.disable();
    // } else {
    //   call.camera.enable();
    //   call.microphone.enable();
    // }
  }, [call]);

  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call) return (
    <p className="text-center text-3xl font-bold text-white">
      Call Not Found
    </p>
  );

  // get more info about custom call type:  https://getstream.io/video/docs/react/guides/configuring-call-types/
  const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;
  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );
    
  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
        <MeetingRoom />
        {/* {!isSetupComplete ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <MeetingRoom />
        )} */}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
