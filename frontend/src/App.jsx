import { useRouter } from './hooks/useRouter'
import { useAnalysis } from './hooks/useAnalysis'
import { useApiKeys } from './hooks/useApiKeys'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Toast from './components/Toast'
import AnalysisPage from './pages/AnalysisPage'
import NewAnalysisPage from './pages/NewAnalysisPage'
import SegmentsPage from './pages/SegmentsPage'
import PromptLibraryPage from './pages/PromptLibraryPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  const { path, navigate } = useRouter()
  const { config, saved, run, rerun, rerunSection, openSaved, getSegmentData, isSectionStreaming, isRunning, toastError, clearToastError } = useAnalysis()
  const { keys, setKeys } = useApiKeys()

  const isNew = path === '/new'
  const isSegments = path === '/segments'
  const isPrompts = path === '/prompts'
  const isSettings = path === '/settings'
  const noSidebar = isNew || isSegments || isSettings

  const handleGenerate = (formData) => {
    navigate('/')
    run(formData)
  }

  const handleOpenSaved = (item) => {
    openSaved(item)
    navigate('/')
  }

  return (
    <div className={'app density-regular layout-default' + (noSidebar ? ' no-sidebar' : '')}>
      <TopBar onHome={() => navigate('/')} />
      {toastError && <Toast message={toastError} onDismiss={clearToastError} />}

      {!noSidebar && (
        <Sidebar
          onNew={() => navigate('/new')}
          onSegments={() => navigate('/segments')}
          onPrompts={() => navigate('/prompts')}
          onSettings={() => navigate('/settings')}
          saved={saved}
          currentSavedId={config?.id}
          onOpenSaved={handleOpenSaved}
        />
      )}

      <main className="canvas">
        {isNew ? (
          <NewAnalysisPage
            onCancel={() => navigate('/')}
            onGenerate={handleGenerate}
          />
        ) : isSegments ? (
          <SegmentsPage />
        ) : isPrompts ? (
          <PromptLibraryPage onBack={() => navigate('/')} />
        ) : isSettings ? (
          <SettingsPage
            keys={keys}
            onSave={setKeys}
            onBack={() => navigate('/')}
          />
        ) : (
          <AnalysisPage
            config={config}
            getSegmentData={getSegmentData}
            isSectionStreaming={isSectionStreaming}
            isRunning={isRunning}
            onNew={() => navigate('/new')}
            onRerun={rerun}
            onRerunSection={rerunSection}
          />
        )}
      </main>
    </div>
  )
}
