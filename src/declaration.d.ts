declare module 'react-signature-canvas' {
  export default class SignatureCanvas extends React.Component<any, any> {
    clear(): void;
    getTrimmedCanvas(): HTMLCanvasElement;
    isEmpty(): boolean;
    toDataURL(): string;
  }
}