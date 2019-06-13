import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UiService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import { Exercise } from './exercise.model';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {

  private fireSubscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromTraining.State>
  ) {}

  public fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fireSubscriptions.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map((response) =>
        response.map(({ payload: { doc } }) => {
          const data: any = doc.data();

          return {
            id: doc.id,
            name: data.name,
            calories: data.calories,
            duration: data.duration
          };
        }))
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        this.store.dispatch(new UI.StopLoading());
      }, () => {
        this.uiService.showSnackbar(
          'Fetching exercises failed, please try again later',
          null,
          3000
        );
        this.store.dispatch(new UI.StopLoading());
      }));
  }

  public startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  public completeExercise() {
    this.store.select(fromTraining.getActiveTrainig).pipe(take(1)).subscribe((ex) => {
      this.addDataToDatabase({
        ...ex,
        date: new Date(),
        state: 'completed'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  public cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTrainig).pipe(take(1)).subscribe((ex) => {
      this.addDataToDatabase({
        ...ex,
        date: new Date(),
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        state: 'cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchCompletedAndCanceledExercises() {
    this.fireSubscriptions.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedTrainings(exercises));
      }));
  }

  cancelFireSubscriptions() {
    this.fireSubscriptions.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db
      .collection('finishedExercises')
      .add(exercise);
  }
}
