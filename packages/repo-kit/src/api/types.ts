export interface BaseResult<D = unknown> {
  detail?: D;
  status: ResultStatus;
}
export interface ErrorResult<E = Error> extends BaseResult<never> {
  error: E;
  status: 'error';
}
export type ResultStatus = 'error' | 'success' | 'warning';
export interface SuccessResult<D = unknown> extends BaseResult<D> {
  detail: D;
  status: 'success';
}

export interface WarningResult<W = unknown> extends BaseResult<W> {
  detail: W;
  status: 'warning';
}
