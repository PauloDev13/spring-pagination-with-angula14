import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';

import { GetUsersResponse } from './interface/get-users-response';
import { Page } from './interface/page';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  usersState$: Observable<{
    appState: string;
    appData?: GetUsersResponse<Page>;
    error?: HttpErrorResponse;
  }>;

  private responseSubject = new BehaviorSubject<GetUsersResponse<Page>>(null);
  private currentSubjectPage = new BehaviorSubject<number>(0);
  currentPage$ = this.currentSubjectPage.asObservable();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.usersState$ = this.userService.users$().pipe(
      map((response: GetUsersResponse<Page>) => {
        this.responseSubject.next(response);
        this.currentSubjectPage.next(response.data.page.number);
        // console.log(response);
        return { appState: 'APP_LOADED', appData: response };
      }),
      startWith({ appState: 'APP_LOADING' }),
      catchError((error: HttpErrorResponse) => of({ appState: 'APP_ERROR', error })),
    );
  }

  goToPage(name?: string, pageNumber: number = 0): void {
    this.usersState$ = this.userService.users$(name, pageNumber).pipe(
      map((response: GetUsersResponse<Page>) => {
        this.responseSubject.next(response);
        this.currentSubjectPage.next(pageNumber);
        // console.log(response);
        return { appState: 'APP_LOADED', appData: response };
      }),
      startWith({ appState: 'APP_LOADED', appData: this.responseSubject.value }),
      catchError((error: HttpErrorResponse) => of({ appState: 'APP_ERROR', error })),
    );
  }

  goToNextOrPreviousPage(direction?: string, name?: string): void {
    this.goToPage(
      name,
      direction === 'forward' ? this.currentSubjectPage.value + 1 : this.currentSubjectPage.value - 1,
    );
  }
}
