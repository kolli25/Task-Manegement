import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { routes } from './app.routes';
import {
  EyeOutline,
  EditOutline,
  DeleteOutline,
  PlusOutline,
  CheckOutline,
  CloseOutline,
  ProjectOutline,
  CalendarOutline,
  FileTextOutline,
  AlignLeftOutline,
  FlagOutline,
  ClockCircleOutline,
  SyncOutline,
  CheckCircleOutline,
  HomeOutline,
  PlusCircleOutline
} from '@ant-design/icons-angular/icons';

const icons = [
  EyeOutline, EditOutline, DeleteOutline,
  PlusOutline, CheckOutline, CloseOutline,
  ProjectOutline, CalendarOutline, FileTextOutline,
  AlignLeftOutline, FlagOutline, ClockCircleOutline,
  SyncOutline, CheckCircleOutline, HomeOutline,
  PlusCircleOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideNzI18n(en_US),
    provideNzIcons(icons)
  ]
};