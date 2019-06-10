import { Exercise } from './exercise.model';
import { Subject, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { UiService } from '../shared/ui.service';

@Injectable()
export class TrainingService {

  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private exercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fireSubscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService
  ) {}

  public fetchExercises() {
    this.uiService.loadingStateChanged.next(true);
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
        this.exercises = exercises;
        this.exercisesChanged.next(exercises);
        this.uiService.loadingStateChanged.next(false);
      }, () => {
        this.uiService.loadingStateChanged.next(false);
        this.exercisesChanged.next(null);
        this.uiService.showSnackbar(
          'Fetching exercises failed, please try again later',
          null,
          3000
        );
      }));
  }

  public startExercise(selectedId: string) {
    this.runningExercise = this.exercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  public completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  public cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      state: 'cancalled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedAndCanceledExercises() {
    this.fireSubscriptions.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
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
