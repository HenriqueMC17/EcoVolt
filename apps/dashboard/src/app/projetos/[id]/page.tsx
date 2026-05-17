import { ProjectDetailsPage } from '@/pages/projetos/ui/ProjectDetailsPage';

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <ProjectDetailsPage projectId={params.id} />;
}
