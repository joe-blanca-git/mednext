import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PanelMockService } from '../../services/panel-mock.service';
import { PanelTicket } from '../../models/panel.models';
import { Subject, Subscription, timer, Observable } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  clinicName = '';
  currentTime = new Date();
  
  currentCall$!: Observable<PanelTicket | null>;
  lastCalled$!: Observable<PanelTicket[]>;
  waiting$!: Observable<PanelTicket[]>;

  isCalling = false; // Used for CSS animations/badge

  constructor(
    private panelService: PanelMockService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentCall$ = this.panelService.currentCall$;
    this.lastCalled$ = this.panelService.lastCalled$;
    this.waiting$ = this.panelService.waiting$.pipe(
      map(tickets => tickets.slice(0, 10)) // Show only up to 10 waiting
    );
  }

  ngOnInit(): void {
    this.clinicName = this.panelService.getClinicName();

    if (isPlatformBrowser(this.platformId)) {
      // Clock timer
      timer(0, 1000).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.currentTime = new Date();
      });

      // Mock calling loop: Call a new ticket every 8 seconds
      timer(2000, 8000).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.announceTicket();
      });
    }
  }

  announceTicket(): void {
    this.panelService.announceNextTicket();
    
    // Trigger visual/audio feedback for the call
    this.isCalling = true;
    
    // Reset visual feedback after a few seconds
    setTimeout(() => {
      this.isCalling = false;
    }, 4000); // 4 seconds animation/badge
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
