type BehaviorProps = {
  behaviorIndex: number;
  setBehaviorIndex: (index: number) => void;
  config?: {
    pageNumber: number;
  };
};

export function Linear(props: BehaviorProps) {
  console.log(props);
  if (props.config?.pageNumber != 1) return null;
  console.log(props);

  return (
    <>
      <div
        className="absolute left-[40%] top-[40%] h-[20%] w-[20%] bg-red-500 opacity-50 cursor-pointer"
        onClick={() => {
          console.log("HELLO");
          // @ts-ignore
          props.setBehaviorIndex(props.behaviorIndex + 1);
        }}
      ></div>
    </>
  );
}

export function Skimming(props: BehaviorProps) {
  console.log(props);
  if (props.config?.pageNumber != 1) return null;
  console.log(props);

  return (
    <>
      <div
        className="absolute left-[30%] top-[30%] h-[20%] w-[20%] bg-red-500 opacity-50 cursor-pointer"
        onClick={() => {
          console.log("HELLO");
        }}
      ></div>
    </>
  );
}

