// implementation of the observer pattern

export interface Observer {
  update(): void;
}

export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}
