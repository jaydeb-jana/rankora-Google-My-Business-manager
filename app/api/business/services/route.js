import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';
import { DEFAULT_SERVICES, INDUSTRY_TEMPLATES } from '@/lib/presets';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({
      success: true,
      services: user.services || [],
      templates: INDUSTRY_TEMPLATES,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description = '', category = '', suggestedKeywords = [] } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Service name is required.' }, { status: 400 });
    }

    const newService = {
      id: 'srv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      suggestedKeywords: Array.isArray(suggestedKeywords) ? suggestedKeywords : [],
    };

    const currentServices = user.services || [];
    const updatedServices = [...currentServices, newService];

    const updatedUser = await userRepo.updateById(user._id, { services: updatedServices });

    return NextResponse.json({
      success: true,
      message: 'Service added successfully.',
      services: updatedUser.services,
      service: newService,
    });
  } catch (err) {
    console.error('[Services POST Error]:', err);
    return NextResponse.json({ error: 'Failed to add service' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if replacing all services (e.g. template reset or reorder)
    if (body.services && Array.isArray(body.services)) {
      const updatedUser = await userRepo.updateById(user._id, { services: body.services });
      return NextResponse.json({
        success: true,
        message: 'Services updated successfully.',
        services: updatedUser.services,
      });
    }

    // Otherwise updating single service by id
    const { id, name, description, category, suggestedKeywords } = body;
    if (!id || !name?.trim()) {
      return NextResponse.json({ error: 'Service ID and Name are required.' }, { status: 400 });
    }

    const currentServices = user.services || [];
    const index = currentServices.findIndex((s) => s.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
    }

    currentServices[index] = {
      ...currentServices[index],
      name: name.trim(),
      description: (description ?? currentServices[index].description).trim(),
      category: (category ?? currentServices[index].category).trim(),
      suggestedKeywords: Array.isArray(suggestedKeywords)
        ? suggestedKeywords
        : currentServices[index].suggestedKeywords,
    };

    const updatedUser = await userRepo.updateById(user._id, { services: currentServices });

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully.',
      services: updatedUser.services,
    });
  } catch (err) {
    console.error('[Services PUT Error]:', err);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('id');

    if (!serviceId) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    const currentServices = user.services || [];
    const updatedServices = currentServices.filter((s) => s.id !== serviceId);

    const updatedUser = await userRepo.updateById(user._id, { services: updatedServices });

    return NextResponse.json({
      success: true,
      message: 'Service removed successfully.',
      services: updatedUser.services,
    });
  } catch (err) {
    console.error('[Services DELETE Error]:', err);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
