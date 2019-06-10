import { Component, OnDestroy, OnInit } from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import 'rxjs-compat/add/operator/map';
import { UiService } from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  isLoading = true;

  private exerciseSubscription: Subscription;
  private loadingSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService
  ) {}

  ngOnInit() {
    this.exerciseSubscription = this.trainingService
      .exercisesChanged
      .subscribe((exercises) => {
        this.exercises = exercises;
      });

    this.loadingSubscription = this.uiService
      .loadingStateChanged
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });

    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService
      .fetchExercises();
  }

  onStartNewTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

}
