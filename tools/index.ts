type Data =
    | {
          type: "Device parameter" | "Slot parameter" | "Channel" | "RM" | "Const" | "BM";
          description: {
              preview: string;
              text: string;
          };
      }
    | {
          type: "Function";
          description: {
              preview: string;
              text: string;
          };
          op1: null | string;
          op2: null | string;
          op3: null | string;
          op4: null | string;
          op5: null | string;
          op6: null | string;
      };
(async () => {
    const rawData = await fetch("https://icx.traineratwot.site/GetIc10").then((x) => x.json());

    const data: Map<string, Data> = new Map(Object.entries(rawData));
    console.log(data)

})();
