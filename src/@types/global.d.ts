declare global {
  var gc: () => void;
  namespace NodeJS {
    interface Process {}
  }
}

export {};
