'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Eye, ZoomIn, ZoomOut, RefreshCw, Search, FileText } from 'lucide-react';
import { Recommendation, Standard } from '@/types';
import { getBisStandardUrl } from '@/utils/bisUrl';
import { DEMO_RELATIONSHIPS } from '@/data/relationships';
import { DEMO_STANDARDS } from '@/data/demoStandards';
import StandardProfileModal from '@/components/explorer/StandardProfileModal';

interface Props {
  recommendations: Recommendation[];
  mainStandardId?: string;
}

const REL_COLORS: Record<string, string> = {
  NORMATIVE_REFERENCE: '#3b82f6',
  TEST_METHOD: '#a78bfa',
  SAFETY: '#ef4444',
  INSTALLATION: '#10b981',
  TERMINOLOGY: '#94a3b8',
  RELATED_PRODUCT: '#f59e0b',
  SUPERSEDES: '#64748b',
  PART_OF: '#60a5fa',
};

const CAT_COLORS: Record<string, string> = {
  'Main Product Standard': '#3b82f6',
  'Testing Standard': '#a78bfa',
  'Safety Standard': '#ef4444',
  'Installation Standard': '#10b981',
  'Terminology Standard': '#94a3b8',
  'Material Standard': '#f59e0b',
  'Performance Standard': '#00d4ff',
  'Related Product Standard': '#64748b',
};

interface NodeData {
  id: string;
  standardNumber: string;
  title: string;
  category: string;
  status: string;
  isMain: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface LinkData {
  source: NodeData | string;
  target: NodeData | string;
  type: string;
  label: string;
}

export default function StandardsGraph({ recommendations, mainStandardId }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [selected, setSelected] = useState<NodeData | null>(null);
  const [profileStandard, setProfileStandard] = useState<Standard | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [dimensions, setDimensions] = useState({ w: 700, h: 460 });

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({ w: entry.contentRect.width, h: Math.max(420, entry.contentRect.height) });
      }
    });
    if (svgRef.current?.parentElement) obs.observe(svgRef.current.parentElement);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || recommendations.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { w, h } = dimensions;

    // Filter recommendations by search filter if any
    const filteredRecs = searchFilter
      ? recommendations.filter(
          (r) =>
            r.standard.standardNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
            r.standard.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
            r.standard.category.toLowerCase().includes(searchFilter.toLowerCase())
        )
      : recommendations;

    // Build nodes
    const nodes: NodeData[] = filteredRecs.map((r) => ({
      id: r.standard.id,
      standardNumber: r.standard.standardNumber,
      title: r.standard.title,
      category: r.standard.category,
      status: r.standard.status,
      isMain: r.standard.id === mainStandardId,
    }));

    const nodeIds = new Set(nodes.map((n) => n.id));

    // Filter relationships
    const links: LinkData[] = DEMO_RELATIONSHIPS
      .filter((rel) => nodeIds.has(rel.sourceStandardId) && nodeIds.has(rel.targetStandardId))
      .map((rel) => ({
        source: rel.sourceStandardId,
        target: rel.targetStandardId,
        type: rel.relationshipType,
        label: rel.relationshipType.replace(/_/g, ' '),
      }));

    // Zoom/pan behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));
    
    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    const g = svg.append('g');

    // Arrow markers
    const defs = svg.append('defs');
    Object.entries(REL_COLORS).forEach(([type, color]) => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color)
        .attr('opacity', 0.7);
    });

    // Force simulation
    const simulation = d3.forceSimulation<NodeData>(nodes)
      .force('link', d3.forceLink<NodeData, LinkData>(links).id((d) => d.id).distance(130).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide(42));

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (d) => REL_COLORS[d.type] || '#64748b')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.8)
      .attr('marker-end', (d) => `url(#arrow-${d.type})`);

    // Link labels
    const linkLabel = g.append('g')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .attr('font-size', 9)
      .attr('fill', (d) => REL_COLORS[d.type] || '#94a3b8')
      .attr('text-anchor', 'middle')
      .attr('opacity', 0.8)
      .attr('font-weight', 600)
      .text((d) => d.label);

    // Nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, NodeData>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
      )
      .on('click', (_, d) => setSelected(d));

    node.append('circle')
      .attr('r', (d) => (d.isMain ? 24 : 18))
      .attr('fill', (d) => (CAT_COLORS[d.category] || '#64748b') + '25')
      .attr('stroke', (d) => CAT_COLORS[d.category] || '#64748b')
      .attr('stroke-width', (d) => (d.isMain ? 3 : 2))
      .attr('filter', (d) => (d.isMain ? 'drop-shadow(0 0 8px rgba(59,130,246,0.6))' : 'none'));

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', (d) => (d.isMain ? 8 : 7.5))
      .attr('font-weight', 700)
      .attr('fill', '#f8fafc')
      .attr('pointer-events', 'none')
      .text((d) => {
        const parts = d.standardNumber.split(' ');
        return parts.length > 2 ? parts.slice(0, 2).join(' ') : d.standardNumber;
      });

    // Category label below node
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => (d.isMain ? 38 : 30))
      .attr('font-size', 7)
      .attr('fill', (d) => CAT_COLORS[d.category] || '#cbd5e1')
      .attr('font-weight', 600)
      .attr('pointer-events', 'none')
      .text((d) => {
        const parts = d.category.split(' ');
        return parts.slice(0, 2).join(' ');
      });

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as NodeData).x!)
        .attr('y1', (d) => (d.source as NodeData).y!)
        .attr('x2', (d) => (d.target as NodeData).x!)
        .attr('y2', (d) => (d.target as NodeData).y!);

      linkLabel
        .attr('x', (d) => ((d.source as NodeData).x! + (d.target as NodeData).x!) / 2)
        .attr('y', (d) => ((d.source as NodeData).y! + (d.target as NodeData).y!) / 2);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [recommendations, mainStandardId, dimensions, searchFilter]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  const openProfile = (nodeId: string) => {
    const std = DEMO_STANDARDS.find((s) => s.id === nodeId);
    if (std) setProfileStandard(std);
  };

  const legendItems = [
    { label: 'Normative Ref', color: REL_COLORS.NORMATIVE_REFERENCE },
    { label: 'Test Method', color: REL_COLORS.TEST_METHOD },
    { label: 'Safety Code', color: REL_COLORS.SAFETY },
    { label: 'Installation', color: REL_COLORS.INSTALLATION },
    { label: 'Related Product', color: REL_COLORS.RELATED_PRODUCT },
  ];

  return (
    <div className="glass-card-bright" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.125rem' }}>
            Standards Relationship Graph
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Click node to view profile • Drag to rearrange • Scroll or use controls to zoom & pan
          </p>
        </div>

        {/* Search & Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 180 }}>
            <Search size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search graph nodes..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '1.75rem', paddingRight: '0.5rem', height: 30, fontSize: '0.725rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: 2 }}>
            <button onClick={handleZoomIn} className="btn-ghost" style={{ padding: '0.25rem 0.5rem', height: 28 }} title="Zoom In">
              <ZoomIn size={14} />
            </button>
            <button onClick={handleZoomOut} className="btn-ghost" style={{ padding: '0.25rem 0.5rem', height: 28 }} title="Zoom Out">
              <ZoomOut size={14} />
            </button>
            <button onClick={handleResetZoom} className="btn-ghost" style={{ padding: '0.25rem 0.5rem', height: 28 }} title="Reset Zoom">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Legend Row */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem', padding: '0.4rem 0.75rem', background: '#0f172a', borderRadius: 8 }}>
        {legendItems.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', color: '#cbd5e1' }}>
            <div style={{ width: 14, height: 3, background: item.color, borderRadius: 1.5 }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* SVG Canvas Area */}
      <div style={{ position: 'relative', background: '#090d16', borderRadius: 10, overflow: 'hidden', height: dimensions.h }}>
        <svg ref={svgRef} width="100%" height="100%" style={{ display: 'block' }} />

        {/* Selected node info popover */}
        {selected && (
          <div
            style={{
              position: 'absolute',
              bottom: 14,
              left: 14,
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid #334155',
              borderRadius: 12,
              padding: '1rem',
              maxWidth: 300,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.725rem', fontWeight: 800, color: CAT_COLORS[selected.category] || '#60a5fa', fontFamily: 'monospace', marginBottom: 2 }}>
                  {selected.standardNumber}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.35, marginBottom: 6 }}>
                  {selected.title}
                </div>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span className="badge badge-blue" style={{ fontSize: '0.625rem' }}>{selected.category}</span>
                  <span className={`badge ${selected.status === 'Current' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.625rem' }}>
                    {selected.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn-primary"
                    onClick={() => openProfile(selected.id)}
                    style={{ fontSize: '0.725rem', padding: '0.35rem 0.65rem', gap: '0.25rem' }}
                  >
                    <FileText size={12} />
                    Open Profile
                  </button>
                  <a
                    href={getBisStandardUrl(selected.standardNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{ fontSize: '0.725rem', padding: '0.35rem 0.65rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <Eye size={12} />
                    BIS Portal
                  </a>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, marginLeft: 8, fontSize: '1.1rem' }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {recommendations.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
            Run an analysis to view the standards relationship graph
          </div>
        )}
      </div>

      {/* Standard Profile Modal Trigger */}
      {profileStandard && (
        <StandardProfileModal
          standard={profileStandard}
          onClose={() => setProfileStandard(null)}
        />
      )}
    </div>
  );
}
