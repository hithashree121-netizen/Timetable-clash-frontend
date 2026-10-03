import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { TimetablePage } from './pages/TimetablePage';
import { ClassesPage } from './pages/ClassesPage';
import { FacultyPage } from './pages/FacultyPage';
import { RoomsPage } from './pages/RoomsPage';
import { ConflictsPage } from './pages/ConflictsPage';
import { GraphViewPage } from './pages/GraphViewPage';
import { OptimizationPage } from './pages/OptimizationPage';
import { ValidationPage } from './pages/ValidationPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

import { ClassItem, FacultyItem, RoomItem, ConflictItem } from './types';
import { classApi } from './api/classApi';
import { facultyApi } from './api/facultyApi';
import { roomApi } from './api/roomApi';
import { conflictApi } from './api/conflictApi';
import { INITIAL_CLASSES, INITIAL_FACULTY, INITIAL_ROOMS, INITIAL_CONFLICTS } from './data/mockData';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Application Data States
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [faculty, setFaculty] = useState<FacultyItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);

  // Load Data on Startup
  const loadData = async () => {
    setIsLoading(true);
    try {
      const clsRes = await classApi.getAll();
      const facRes = await facultyApi.getAll();
      const rmRes = await roomApi.getAll();
      const cnfRes = await conflictApi.getConflicts();

      setClasses(clsRes.data);
      setFaculty(facRes.data);
      setRooms(rmRes.data);
      setConflicts(cnfRes.data);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      // Fallback
      setClasses(INITIAL_CLASSES);
      setFaculty(INITIAL_FACULTY);
      setRooms(INITIAL_ROOMS);
      setConflicts(INITIAL_CONFLICTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Actions
  const handleAddClass = async (newClass: Omit<ClassItem, 'id'>) => {
    const res = await classApi.add(newClass);
    setClasses(prev => [...prev, res.data]);
  };

  const handleDeleteClass = async (id: string) => {
    await classApi.delete(id);
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const handleAddFaculty = async (item: Omit<FacultyItem, 'id'>) => {
    const res = await facultyApi.add(item);
    setFaculty(prev => [...prev, res.data]);
  };

  const handleDeleteFaculty = async (id: string) => {
    await facultyApi.delete(id);
    setFaculty(prev => prev.filter(f => f.id !== id));
  };

  const handleAddRoom = async (item: Omit<RoomItem, 'id'>) => {
    const res = await roomApi.add(item);
    setRooms(prev => [...prev, res.data]);
  };

  const handleDeleteRoom = async (id: string) => {
    await roomApi.delete(id);
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const handleResetMockData = () => {
    setClasses([...INITIAL_CLASSES]);
    setFaculty([...INITIAL_FACULTY]);
    setRooms([...INITIAL_ROOMS]);
    setConflicts([...INITIAL_CONFLICTS]);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="pulse-glow" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
            Initializing Timetable Intelligence Engine...
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage classes={classes} conflicts={conflicts} onNavigate={setActiveTab} />;

      case 'timetable':
        return (
          <TimetablePage
            classes={classes}
            onValidate={() => setActiveTab('validation')}
            onRegenerate={() => setActiveTab('optimization')}
          />
        );

      case 'classes':
        return (
          <ClassesPage
            classes={classes}
            onAddClass={handleAddClass}
            onDeleteClass={handleDeleteClass}
          />
        );

      case 'faculty':
        return (
          <FacultyPage
            facultyList={faculty}
            onAddFaculty={handleAddFaculty}
            onDeleteFaculty={handleDeleteFaculty}
          />
        );

      case 'rooms':
        return (
          <RoomsPage
            roomsList={rooms}
            onAddRoom={handleAddRoom}
            onDeleteRoom={handleDeleteRoom}
          />
        );

      case 'conflicts':
        return (
          <ConflictsPage
            conflicts={conflicts}
            classes={classes}
            onUpdateConflicts={setConflicts}
          />
        );

      case 'graph':
        return <GraphViewPage classes={classes} />;

      case 'optimization':
        return (
          <OptimizationPage
            classes={classes}
            onOptimizationComplete={optimizedClasses => {
              setClasses(optimizedClasses);
              setActiveTab('timetable');
            }}
          />
        );

      case 'validation':
        return <ValidationPage classes={classes} onNavigate={setActiveTab} />;

      case 'reports':
        return <ReportsPage classes={classes} />;

      case 'settings':
        return <SettingsPage onResetData={handleResetMockData} />;

      default:
        return <DashboardPage classes={classes} conflicts={conflicts} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header activeTab={activeTab} onRefresh={loadData} />

        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
