import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationError, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';
import { AccountService } from '_services/account.service';
import { SpinnerService } from '_services/spinner.service';
import { error } from 'console';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router,
    private toastr: ToastrService,
    private accountServices: AccountService,
    private spinnerService : SpinnerService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.spinnerService.requestStarted();
    return next.handle(request)
      .pipe(
        tap(
          (event) => {
              if (event instanceof HttpResponse) {
                this.spinnerService.requestEnded();
              }
          },
          (error: HttpErrorResponse) => {
            this.spinnerService.resetSpinner();
              switch (error.status) {
                case 400:
                  if (error.error.errors) {
                    const modelStatusErrors = [];
                    console.log(error);
                    for (const key in error.error.errors) {
                      if (error.error.errors[key]) {
                        modelStatusErrors.push(error.error.errors[key]);
                      }
                    }
                    throw modelStatusErrors.flat();
                  }
                  else {
                    this.toastr.error(error.error);
                  }
                  break;
                case 401:
                  this.toastr.error(error.error);
                  if (!this.accountServices.loggedIn()) {
                    this.accountServices.logout();
                    this.accountServices.decodedToken = null;
                    this.router.navigateByUrl('/');
                  }
                  break;
                case 404:
                  this.router.navigateByUrl('/not-found');
                  break;
                case 500:
                  const navigationExtras: NavigationExtras = { state: { error: error.error } }
                  this.router.navigateByUrl('/server-error', navigationExtras);
                  break;
                default:
                  this.toastr.error("Somthing unexpected went wrong");
                  console.log(error);
                  break;
              }
              throw error;
          }
          ),
          
        )

  }
}
