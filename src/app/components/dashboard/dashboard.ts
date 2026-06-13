import { Component, OnInit, OnDestroy, signal, computed, inject, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, Profile, Supabase } from '../../services/supabase';
import { Landing } from '../landing/landing';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy, AfterViewInit {
  // Signals
  allTasks = signal<Task[]>([]);
  importanceThreshold = signal(10);
  filteredTasks = computed(() => {
    return this.filterByImportance(this.allTasks(), this.importanceThreshold())
  });
  profile = signal<Profile | null>(null);

  today = new Date();
  tomorrow = new Date();

  // Current time line
  nowPosition = signal(0);
  showNowLine = signal(false);
  private nowInterval: any;

  // Drag scrolling
  @ViewChildren('timeline') timelines!: QueryList<ElementRef>;
  private dragState: {
    isDragging: boolean;
    startY: number;
    scrollTop: number;
    element: HTMLElement | null;
  } = {
    isDragging: false,
    startY: 0,
    scrollTop: 0,
    element: null
  };
  supabase = inject(Supabase);

  async ngOnInit() {
    const userID = localStorage.getItem('userId');

    if(!userID) {
      console.error('No user ID found');
      return;
    }


    this.today.setHours(0, 0, 0, 0);

    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);

    const profile = await this.supabase.getProfile(userID);

    if (!profile || !profile.household_id) {
      console.error('Profile or household not found');
      return;
    }

    this.profile.set(profile);

    const tasks = await this.supabase.getTasks(profile.household_id, this.today, this.tomorrow);
    this.allTasks.set(tasks);

    this.updateNowLine();
    this.nowInterval = setInterval(() => this.updateNowLine(), 60000); // Update every minute
  }

  ngAfterViewInit() {
    this.scrollToNow();
  }

  ngOnDestroy() {
    if (this.nowInterval) {
      clearInterval(this.nowInterval);
    }

    // Clean up global listeners
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  // ---- Now Line ----
  updateNowLine() {
    const now = new Date();
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    // Only show line if today is actually today
    if (now >= todayMidnight) {
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      this.nowPosition.set((totalMinutes / 60) * 60); // 60px per hour
      this.showNowLine.set(true);
    }
  }

  scrollToNow() {
    // Scroll timelines to current time on load
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const scrollPosition = (totalMinutes / 60) * 60 - 100; // Offset slightly above now line

    setTimeout(() => {
      this.timelines.forEach(timeline => {
        timeline.nativeElement.scrollTop = Math.max(0, scrollPosition);
      });
    }, 100);
  }

  // ---- Drag Scroll ----
  onMouseDown(event: MouseEvent, timelineEl: HTMLElement) {
    this.dragState = {
      isDragging: true,
      startY: event.clientY,
      scrollTop: timelineEl.scrollTop,
      element: timelineEl
    };

    timelineEl.style.cursor = 'grabbing';
    timelineEl.style.userSelect = 'none';

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    if (!this.dragState.isDragging || !this.dragState.element) return;

    const deltaY = event.clientY - this.dragState.startY;
    this.dragState.element.scrollTop = this.dragState.scrollTop - deltaY;
  }

  onMouseUp = () => {
    if (!this.dragState.element) return;

    this.dragState.element.style.cursor = 'grab';
    this.dragState.element.style.userSelect = '';
    this.dragState.isDragging = false;
    this.dragState.element = null;

    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  // ---- Tasks ----
  filterByImportance(tasks: Task[], threshold: number): Task[] {
    return tasks.filter(task => task.importance >= threshold);
  }

  onSliderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.importanceThreshold.set(Number(target.value));
  }

  getTasksForDay(date: Date): Task[] {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return this.filteredTasks().filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= dayStart && taskDate <= dayEnd;
    });
  }

  getTaskTime(task: Task): string {
    const taskDate = new Date(task.date);
    return taskDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  getTaskTopPosition(task: Task): string {
    const taskDate = new Date(task.date);
    const hours = taskDate.getHours();
    const minutes = taskDate.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return `${(totalMinutes / 60) * 60}px`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
}